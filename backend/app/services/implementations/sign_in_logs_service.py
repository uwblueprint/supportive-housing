import os
from ..interfaces.sign_in_logs_service import ISignInLogService
from ...models.sign_in_logs import SignInLogs
from ...models import db
from datetime import datetime
from pytz import timezone
from sqlalchemy import select, cast, Date
import json


class SignInLogService(ISignInLogService):
    """
    SignInLogService implementation with log management methods
    """

    def __init__(self, logger):
        """
        Create an instance of SignInLogService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def create_sign_in_log(self, user_id):
        sign_in = {"id": user_id, "time": datetime.now()}
        try:
            if os.getenv("CREATE_SIGN_IN_LOG") == "True":
                new_sign_in = SignInLogs(**sign_in)
                db.session.add(new_sign_in)
                db.session.commit()
        except Exception as postgres_error:
            raise postgres_error

    def get_sign_in_logs_list(self, logs):
        try:
            logs_list = []
            # return as json object
            for log in logs:
                logs_list.append(
                    {
                        "log_id": log.log_id,
                        "id": log.id,
                        "time": str(log.time.astimezone(timezone("US/Eastern"))),
                    }
                )
            return json.dumps(logs_list)
        except Exception as postgres_error:
            raise postgres_error

    def get_sign_in_logs_by_id(self, user_id):
        try:
            sign_in_logs = SignInLogs.query.filter_by(id=user_id).order_by(
                SignInLogs.time.desc()
            )[:100]
            return self.get_sign_in_logs_list(sign_in_logs)
        except Exception as postgres_error:
            raise postgres_error

    def get_sign_in_logs_by_date_range(self, start_date, end_date):
        try:
            sign_in_logs = SignInLogs.query.filter(
                SignInLogs.time >= start_date, SignInLogs.time <= end_date
            ).order_by(SignInLogs.time.desc())[:100]
            return self.get_sign_in_logs_list(sign_in_logs)
        except Exception as postgres_error:
            raise postgres_error

    def get_sign_in_logs_by_date_range_and_id(self, start_date, end_date, user_id):
        try:
            sign_in_logs = (
                SignInLogs.query.filter(
                    SignInLogs.time >= start_date, SignInLogs.time <= end_date
                )
                .filter_by(id=user_id)
                .order_by(SignInLogs.time.desc())[:100]
            )
            return self.get_sign_in_logs_list(sign_in_logs)
        except Exception as postgres_error:
            raise postgres_error
