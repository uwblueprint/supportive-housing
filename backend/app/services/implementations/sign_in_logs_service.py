import os
from ..interfaces.sign_in_logs_service import ISignInLogService
from ...models.sign_in_logs import SignInLogs
from ...models.user import User
from ...models import db
from datetime import datetime
from pytz import timezone, utc
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
        sign_in = {"id": user_id, "time": datetime.now(utc)}
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
            for sign_in_log, first_name, last_name in logs:
                logs_list.append(
                    {
                        "id": sign_in_log.log_id,
                        "first_name": first_name,
                        "last_name": last_name,
                        "time": sign_in_log.time.isoformat(),
                    }
                )
            return logs_list
        except Exception as postgres_error:
            raise postgres_error

    def get_sign_in_logs_by_id(self, user_id):
        try:
            sign_in_logs = (
                SignInLogs.query.join(
                    User, User.id == SignInLogs.id
                )
                .with_entities(SignInLogs, User.first_name, User.last_name)
                .filter_by(id=user_id).order_by(
                    SignInLogs.time.desc()
                )
            )
            return self.get_sign_in_logs_list(sign_in_logs)
        except Exception as postgres_error:
            raise postgres_error

    def get_sign_in_logs_by_date_range(self, page_number, results_per_page, start_date, end_date):

        start_date_utc = datetime.fromisoformat(start_date.replace("Z", "+00:00")).replace(tzinfo=utc)
        end_date_utc = datetime.fromisoformat(end_date.replace("Z", "+00:00")).replace(tzinfo=utc)

        try:
            sign_in_logs = (
                SignInLogs.query.join(
                    User, User.id == SignInLogs.id
                )
                .with_entities(SignInLogs, User.first_name, User.last_name)
                .filter(
                    SignInLogs.time >= start_date_utc, SignInLogs.time <= end_date_utc
                )
                .order_by(
                    SignInLogs.time.desc()
                )
                .limit(results_per_page)
                .offset((page_number - 1) * results_per_page)
            )
            return self.get_sign_in_logs_list(sign_in_logs)
        except Exception as postgres_error:
            raise postgres_error
        
    def count_sign_in_logs_by_date_range(self, start_date, end_date):

        start_date_utc = datetime.fromisoformat(start_date.replace("Z", "+00:00")).replace(tzinfo=utc)
        end_date_utc = datetime.fromisoformat(end_date.replace("Z", "+00:00")).replace(tzinfo=utc)

        try:
            count = (
                SignInLogs.query.filter(
                    SignInLogs.time >= start_date_utc, SignInLogs.time <= end_date_utc
                )
                .count()
            )
            return count
        except Exception as postgres_error:
            raise postgres_error

    def get_sign_in_logs_by_date_range_and_id(self, start_date, end_date, user_id):
        try:
            sign_in_logs = (
                SignInLogs.query.join(
                    User, User.id == SignInLogs.id
                )
                .with_entities(SignInLogs, User.first_name, User.last_name)
                .filter(
                    SignInLogs.time >= start_date, SignInLogs.time <= end_date
                )
                .filter_by(id=user_id)
                .order_by(
                    SignInLogs.time.desc()
                )
            )
            return self.get_sign_in_logs_list(sign_in_logs)
        except Exception as postgres_error:
            raise postgres_error
