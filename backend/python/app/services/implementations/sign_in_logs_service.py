from ..interfaces.sign_in_logs_service import ISignInLogService
from ...models.sign_in_logs import SignInLogs
from ...models import db
from datetime import datetime, timezone
from pytz import timezone
from sqlalchemy import select
#do we have to import user table?


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
#access to user_id?, does it turn into foreign key automatically 
    def create_log(self, user_id):
       
        tz = timezone('EST')
        print("omghere")
        print(datetime.now(timezone('US/Eastern')))
        sign_in = {
            "id": user_id,
            "time": datetime.now(timezone('US/Eastern'))
        }
        try:
            new_sign_in = SignInLogs(**sign_in)
            print("this is", new_sign_in.to_dict())
            db.session.add(new_sign_in)
            db.session.commit()
        except Exception as postgres_error:
            raise postgres_error
    
    def get_logs_by_id(self, user_id):
        try:
            sign_in_logs = SignInLogs.query.filter_by(id=user_id)
            return sign_in_logs
        except Exception as postgres_error:
            raise postgres_error
            

