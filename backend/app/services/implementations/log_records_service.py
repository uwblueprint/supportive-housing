from ..interfaces.log_records_service import ILogRecordsService
from ...models.log_records import LogRecords
from ...models.user import User
from ...models import db
from datetime import datetime
from pytz import timezone
from sqlalchemy import select, cast, Date, text
import os


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
        new_log_record = log_record
        new_log_record["datetime"] = datetime.now()

        try:
            new_log_record = LogRecords(**new_log_record)
            db.session.add(new_log_record)
            db.session.commit()
            return log_record
        except Exception as postgres_error:
            raise postgres_error

    def to_json_list(self, logs):
        try:
            logs_list = []
            for log in logs:
                logs_list.append(
                    {
                        "log_id": log[0],
                        "employee_id": log[1],
                        "resident_first_name": log[2],
                        "resident_last_name": log[3],
                        "datetime": str(log[4].astimezone(timezone("US/Eastern"))),
                        "flagged": log[5],
                        "attn_to": log[6],
                        "note": log[7],
                        "tags": log[8],
                        "building": log[9],
                        "employee_first_name": log[10],
                        "employee_last_name": log[11],
                        "attn_to_first_name": log[12],
                        "attn_to_last_name": log[13],
                    }
                )
            return logs_list
        except Exception as postgres_error:
            raise postgres_error

    def filter_by_building(self, building):
        return f"\nbuilding='{building}'"

    def filter_by_employee_id(self, employee_id):
        if type(employee_id) == list:
            sql_statement = f"\nemployee_id={employee_id[0]}"
            for i in range(1, len(employee_id)):
                sql_statement = sql_statement + f"\nOR employee_id={employee_id[i]}"
            return sql_statement
        return f"\nemployee_id={employee_id}"

    def filter_by_attn_to(self, attn_to):
        if type(attn_to) == list:
            sql_statement = f"\nattn_to={attn_to[0]}"
            for i in range(1, len(attn_to)):
                sql_statement = sql_statement + f"\nOR attn_to={attn_to[i]}"
            return sql_statement
        return f"\nattn_to={attn_to}"

    def filter_by_date_range(self, date_range):
        start_date = datetime.strptime(date_range[0], "%Y-%m-%d").strftime("%m.%d.%Y")
        end_date = (
            datetime.strptime(date_range[1], "%Y-%m-%d")
            .replace(hour=23, minute=59)
            .strftime("%m.%d.%Y")
        )
        return f"\ndatetime>='{start_date}' AND datetime<='{end_date}'"

    def filter_by_tags(self, tags):
        sql_statement = f"\n'{tags[0]}'=ANY (tags)"
        for i in range(1, len(tags)):
            sql_statement = sql_statement + f"\nOR '{tags[i]}'=ANY (tags)"
        return sql_statement

    def filter_by_flagged(self, flagged):
        print(flagged)
        return f"\nflagged={bool(flagged)}"

    def get_log_records(self, page_number=0, export_type="", filters=None):
        try:
            results_per_page = int(os.getenv("RESULTS_PER_PAGE"))

            if not export_type:
                start_index = (page_number - 1) * results_per_page
                end_index = start_index + results_per_page

            sql = "SELECT\n \
                logs.log_id,\n \
                logs.employee_id,\n \
                logs.resident_first_name,\n \
                logs.resident_last_name,\n \
                logs.datetime,\n \
                logs.flagged,\n \
                logs.attn_to,\n \
                logs.note,\n \
                logs.tags,\n \
                logs.building,\n \
                employees.first_name AS employee_first_name,\n \
                employees.last_name AS employee_last_name,\n \
                attn_tos.first_name AS attn_to_first_name,\n \
                attn_tos.last_name AS attn_to_last_name\n \
                FROM log_records logs\n \
                LEFT JOIN users attn_tos ON logs.attn_to = attn_tos.id\n \
                JOIN users employees ON logs.employee_id = employees.id"

            if filters:
                is_first_filter = True

                options = {
                    "building": self.filter_by_building,
                    "employee_id": self.filter_by_employee_id,
                    "attn_to": self.filter_by_attn_to,
                    "date_range": self.filter_by_date_range,
                    "tags": self.filter_by_tags,
                    "flagged": self.filter_by_flagged,
                }
                for filter in filters:
                    if filters.get(filter):
                        if is_first_filter:
                            sql = (
                                sql + "\nWHERE " + options[filter](filters.get(filter))
                            )
                            is_first_filter = False
                        else:
                            if filters.get(filter):
                                sql = (
                                    sql
                                    + "\nAND "
                                    + options[filter](filters.get(filter))
                                )

            sql = sql + "\nORDER BY datetime DESC"
            log_records = db.session.execute(text(sql))
            json_list = self.to_json_list(log_records)
            num_results = len(json_list)

            if not export_type:
                return {
                "log_records": json_list[start_index:end_index],
                "num_results": num_results,
                }   
            else:
                return {
                    "log_records": json_list,
                    "num_results": num_results,
                    "export_type": export_type
                }

        except Exception as postgres_error:
            raise postgres_error

    def delete_log_record(self, log_id):
        deleted_log_record = LogRecords.query.filter_by(log_id=log_id).delete()
        if not deleted_log_record:
            raise Exception(
                "Log record with id {log_id} not found".format(log_id=log_id)
            )
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
        if "note" in updated_log_record:
            LogRecords.query.filter_by(log_id=log_id).update(
                {LogRecords.note: updated_log_record["note"]}
            )
        else:
            LogRecords.query.filter_by(log_id=log_id).update(
                {
                    LogRecords.note: None,
                }
            )
        if "tags" in updated_log_record:
            LogRecords.query.filter_by(log_id=log_id).update(
                {LogRecords.tags: updated_log_record["tags"]}
            )
        else:
            LogRecords.query.filter_by(log_id=log_id).update(
                {
                    LogRecords.tags: None,
                }
            )
        updated_log_record = LogRecords.query.filter_by(log_id=log_id).update(
            {
                LogRecords.employee_id: updated_log_record["employee_id"],
                LogRecords.resident_first_name: updated_log_record[
                    "resident_first_name"
                ],
                LogRecords.resident_last_name: updated_log_record["resident_last_name"],
                LogRecords.flagged: updated_log_record["flagged"],
                LogRecords.building: updated_log_record["building"],
            }
        )
        if not updated_log_record:
            raise Exception(
                "Log record with id {log_id} not found".format(log_id=log_id)
            )
        db.session.commit()
