from ..interfaces.log_records_service import ILogRecordsService
from ...models.log_records import LogRecords
from ...models.residents import Residents
from ...models.user import User
from ...models.tags import Tag
from ...models import db
from datetime import datetime
from pytz import timezone
from sqlalchemy import text


class LogRecordsService(ILogRecordsService):
    """
    LogRecordsService implementation with log records management methods
    """

    def __init__(self, logger):
        """
        Create an instance of LogRecordsService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def add_record(self, log_record):
        new_log_record = log_record.copy()
        residents = new_log_record["residents"]
        tag_names = new_log_record["tags"]

        del new_log_record["residents"]
        del new_log_record["tags"]

        try:
            new_log_record = LogRecords(**new_log_record)
            self.construct_residents(new_log_record, residents)
            self.construct_tags(new_log_record, tag_names)

            db.session.add(new_log_record)
            db.session.commit()
            return log_record
        except Exception as postgres_error:
            raise postgres_error

    def construct_residents(self, log_record, residents):
        residents = list(set(residents))
        for resident_id in residents:
            resident = Residents.query.filter_by(id=resident_id).first()

            if not resident:
                raise Exception(f"Resident with id {resident_id} does not exist")
            log_record.residents.append(resident)

    def construct_tags(self, log_record, tag_names):
        for tag_name in tag_names:
            tag = Tag.query.filter_by(name=tag_name).first()

            if not tag:
                raise Exception(f"Tag with name {tag_name} does not exist")
            log_record.tags.append(tag)

    def to_json_list(self, logs):
        try:
            logs_list = []
            for log in logs:
                logs_list.append(
                    {
                        "log_id": log[0],
                        "employee": {
                            "id": log[1],
                            "first_name": log[2],
                            "last_name": log[3],
                        },
                        "residents": log[4],
                        "attn_to": {
                            "id": log[5],
                            "first_name": log[6],
                            "last_name": log[7],
                        }
                        if log[5]
                        else None,
                        "building": {"id": log[8], "name": log[9]},
                        "tags": log[10] if log[10] else [],
                        "note": log[11],
                        "flagged": log[12],
                        "datetime": str(log[13].astimezone(timezone("US/Eastern"))),
                    }
                )
            return logs_list
        except Exception as postgres_error:
            raise postgres_error

    def filter_by_building_id(self, building_id):
        if type(building_id) == list:
            sql_statement = f"\nlogs.building_id={building_id[0]}"
            for i in range(1, len(building_id)):
                sql_statement = (
                    sql_statement + f"\nOR logs.building_id={building_id[i]}"
                )
            return sql_statement
        return f"\logs.building_id={building_id}"

    def filter_by_employee_id(self, employee_id):
        if type(employee_id) == list:
            sql_statement = f"\nemployee_id={employee_id[0]}"
            for i in range(1, len(employee_id)):
                sql_statement = sql_statement + f"\nOR employee_id={employee_id[i]}"
            return sql_statement
        return f"\nemployee_id={employee_id}"

    def filter_by_residents(self, residents):
        if type(residents) == list:
            sql_statement = f"\n'{residents[0]}'=ANY (resident_ids)"
            for i in range(1, len(residents)):
                sql_statement = (
                    sql_statement + f"\nAND '{residents[i]}'=ANY (resident_ids)"
                )
            return sql_statement
        return f"\n'{residents}'=ANY (resident_ids)"

    def filter_by_attn_to(self, attn_to):
        if type(attn_to) == list:
            sql_statement = f"\nattn_to={attn_to[0]}"
            for i in range(1, len(attn_to)):
                sql_statement = sql_statement + f"\nOR attn_to={attn_to[i]}"
            return sql_statement
        return f"\nattn_to={attn_to}"

    def filter_by_date_range(self, date_range):
        sql = ""
        if len(date_range) > 0:
            if date_range[0] != "":
                start_date = datetime.strptime(date_range[0], "%Y-%m-%d").replace(
                    hour=0, minute=0
                )
                sql += f"\ndatetime>='{start_date}'"
            if date_range[-1] != "":
                end_date = datetime.strptime(
                    date_range[len(date_range) - 1], "%Y-%m-%d"
                ).replace(hour=23, minute=59)

                if sql == "":
                    sql += f"\ndatetime<='{end_date}'"
                else:
                    sql += f"\nAND datetime<='{end_date}'"
        return sql

    def filter_by_tags(self, tags):
        if len(tags) >= 1:
            sql_statement = f"\n'{tags[0]}'=ANY (tag_names)"
            for i in range(1, len(tags)):
                sql_statement = sql_statement + f"\nAND '{tags[i]}'=ANY (tag_names)"
            return sql_statement
        return f"\n'{tags}'=ANY (tag_names)"

    def filter_by_flagged(self, flagged):
        print(flagged)
        return f"\nflagged={bool(flagged)}"

    def filter_log_records(self, filters=None):
        sql = ""

        if filters:
            is_first_filter = True

            options = {
                "building_id": self.filter_by_building_id,
                "employee_id": self.filter_by_employee_id,
                "residents": self.filter_by_residents,
                "attn_to": self.filter_by_attn_to,
                "date_range": self.filter_by_date_range,
                "tags": self.filter_by_tags,
                "flagged": self.filter_by_flagged,
            }
            for filter in filters:
                if filters.get(filter):
                    if is_first_filter:
                        sql = sql + "\nWHERE " + options[filter](filters.get(filter))
                        is_first_filter = False
                    else:
                        if filters.get(filter):
                            sql = sql + "\nAND " + options[filter](filters.get(filter))
        return sql

    def join_resident_attributes(self):
        return "\nLEFT JOIN\n \
                    (SELECT logs.log_id, ARRAY_AGG(residents.id) AS resident_ids, ARRAY_AGG(CONCAT(residents.initial, residents.room_num)) AS residents FROM log_records logs\n \
                    JOIN log_record_residents lrr ON logs.log_id = lrr.log_record_id\n \
                    JOIN residents ON lrr.resident_id = residents.id\n \
                    GROUP BY logs.log_id \n \
                ) r ON logs.log_id = r.log_id\n"

    def join_tag_attributes(self):
        return "\nLEFT JOIN\n \
                    (SELECT logs.log_id, ARRAY_AGG(tags.name) AS tag_names FROM log_records logs\n \
                    JOIN log_record_tag lrt ON logs.log_id = lrt.log_record_id\n \
                    JOIN tags ON lrt.tag_id = tags.tag_id\n \
                    GROUP BY logs.log_id \n \
                ) t ON logs.log_id = t.log_id\n"

    def get_log_records(
        self, page_number, return_all, results_per_page=10, filters=None
    ):
        try:
            sql = "SELECT\n \
                logs.log_id,\n \
                logs.employee_id,\n \
                employees.first_name AS employee_first_name,\n \
                employees.last_name AS employee_last_name,\n \
                r.residents,\n \
                logs.attn_to,\n \
                attn_tos.first_name AS attn_to_first_name,\n \
                attn_tos.last_name AS attn_to_last_name,\n \
                buildings.id AS building_id,\n \
                buildings.name AS building_name,\n \
                t.tag_names, \n \
                logs.note,\n \
                logs.flagged,\n \
                logs.datetime\n \
                FROM log_records logs\n \
                LEFT JOIN users attn_tos ON logs.attn_to = attn_tos.id\n \
                JOIN users employees ON logs.employee_id = employees.id\n \
                JOIN buildings on logs.building_id = buildings.id"

            sql += self.join_resident_attributes()
            sql += self.join_tag_attributes()
            sql += self.filter_log_records(filters)

            sql += "\nORDER BY datetime DESC"

            if not return_all:
                sql += f"\nLIMIT {results_per_page}"
                sql += f"\nOFFSET {(page_number - 1) * results_per_page}"

            log_records = db.session.execute(text(sql))
            json_list = self.to_json_list(log_records)

            return {
                "log_records": json_list,
            }

        except Exception as postgres_error:
            raise postgres_error

    def count_log_records(self, filters=None):
        try:
            sql = "SELECT\n \
            COUNT(*)\n \
            FROM log_records logs\n \
            LEFT JOIN users attn_tos ON logs.attn_to = attn_tos.id\n \
            JOIN users employees ON logs.employee_id = employees.id\n \
            JOIN buildings on logs.building_id = buildings.id"

            sql += self.join_resident_attributes()
            sql += self.join_tag_attributes()
            sql += self.filter_log_records(filters)

            num_results = db.session.execute(text(sql))

            return {
                "num_results": num_results.fetchone()[0],
            }

        except Exception as postgres_error:
            raise postgres_error

    def delete_log_record(self, log_id):
        log_record_to_delete = LogRecords.query.filter_by(log_id=log_id).first()
        if not log_record_to_delete:
            raise Exception(
                "Log record with id {log_id} not found".format(log_id=log_id)
            )
        log_record_to_delete.residents = []
        log_record_to_delete.tags = []
        db.session.delete(log_record_to_delete)
        db.session.commit()

    def update_log_record(self, log_id, updated_log_record):
        if "attn_to" in updated_log_record:
            LogRecords.query.filter_by(log_id=log_id).update(
                {
                    LogRecords.attn_to: updated_log_record["attn_to"],
                }
            )
        else:
            LogRecords.query.filter_by(log_id=log_id).update(
                {
                    LogRecords.attn_to: None,
                }
            )
        if "tags" in updated_log_record:
            log_record = LogRecords.query.filter_by(log_id=log_id).first()
            if log_record:
                log_record.tags = []
                self.construct_tags(log_record, updated_log_record["tags"])
        else:
            LogRecords.query.filter_by(log_id=log_id).update(
                {
                    LogRecords.tags: None,
                }
            )

        log_record = LogRecords.query.filter_by(log_id=log_id).first()
        if log_record:
            log_record.residents = []
            self.construct_residents(log_record, updated_log_record["residents"])

        updated_log_record = LogRecords.query.filter_by(log_id=log_id).update(
            {
                LogRecords.employee_id: updated_log_record["employee_id"],
                LogRecords.flagged: updated_log_record["flagged"],
                LogRecords.building_id: updated_log_record["building_id"],
                LogRecords.note: updated_log_record["note"],
                LogRecords.datetime: updated_log_record["datetime"],
            }
        )
        if not updated_log_record:
            raise Exception(
                "Log record with id {log_id} not found".format(log_id=log_id)
            )
        db.session.commit()
