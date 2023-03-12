from ..interfaces.log_records_service import ILogRecordsService
from ...models.log_records import LogRecords
from ...models import db
from datetime import datetime
from pytz import timezone
from sqlalchemy import select, cast, Date
import json


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
        new_log_record["time"] = datetime.now()
        try:
            new_log_record = LogRecords(**new_log_record)
            db.session.add(new_log_record)
            db.session.commit()
            return log_record
        except Exception as postgres_error:
            raise postgres_error

    def get_logs_list(self, logs):
        try:
            logs_list = []
            # return as json object
            for log in logs:
                logs_list.append(
                    {
                        "log_id": log.log_id,
                        "employee_id": log.employee_id,
                        "resident_first_name": log.resident_first_name,
                        "resdient_last_name": log.resident_last_name,
                        "time": str(log.time.astimezone(timezone("US/Eastern"))),
                        "flagged": log.flagged,
                        "attn_to": log.attn_to,
                        "note": log.note
                    }
                )
            return json.dumps(logs_list)
        except Exception as postgres_error:
            raise postgres_error
        
    def get_log_records(self, start_index=None, end_index=None):
        try:
            if(start_index and end_index and start_index):
                log_records = LogRecords.query.order_by(LogRecords.time.desc())[start_index:end_index]
            else:
                log_records = LogRecords.query.order_by(LogRecords.time.desc())
            return self.get_logs_list(log_records)
        except Exception as postgres_error:
            raise postgres_error
        
    def delete_log_record(self, log_id):
        deleted_log_record = LogRecords.query.filter_by(log_id=log_id).delete()
        if not deleted_log_record:
            raise Exception(
                "Log record with id {log_id} not found".format(
                    log_id=log_id
                )
            )
        db.session.commit()

    def update_log_record(self, log_id, updated_log_record):
        if "attn_to" in updated_log_record:
            LogRecords.query.filter_by(log_id=log_id).update(
                {
                    LogRecords.attn_to: updated_log_record["attn_to"]
                }
            )
        if "note" in updated_log_record:
            LogRecords.query.filter_by(log_id=log_id).update(
                {
                    LogRecords.note: updated_log_record["note"]
                }
            )
        updated_log_record = LogRecords.query.filter_by(log_id=log_id).update(
            {
                LogRecords.employee_id: updated_log_record["employee_id"],
                LogRecords.resident_first_name: updated_log_record["resident_first_name"],
                LogRecords.resident_last_name: updated_log_record["resident_last_name"],
                LogRecords.flagged: updated_log_record["flagged"],
            }
        )

        if not updated_log_record:
            raise Exception(
                "Log record with id {log_id} not found".format(
                    log_id=log_id
                )
            )
        db.session.commit()

