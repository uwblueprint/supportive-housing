from ..interfaces.invite_users_service import IInviteUserService
from ...models.invited_users import InvitedUsers
from ...models import db
from ...resources.invited_user_dto import InvitedUserDTO

class InviteUserService(IInviteUserService):
    """
    InviteUserService interface with methods to manage invited users
    """

    def __init__(self, logger, email_service=None):
        """
        Create an instance of InviteUserService

        :param logger: application's logger instance
        :type logger: logger
        :param email_service: an email_service instance
        :type email_service: IEmailService
        """
        self.logger = logger
        self.email_service = email_service
        
    def get_user_by_id(self, user_id):
        try:
            invited_user_entry = InvitedUsers.query.get(user_id)

            if not invited_user_entry:
                raise Exception("user_id {user_id} not found".format(user_id))
            
            return InvitedUserDTO(
                invited_user_entry.id,
                invited_user_entry.email,
                invited_user_entry.role
            )
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_by_email(self, email):
        try:
            invited_user_entry = InvitedUsers.query.filter_by(email=email).first()

            if not invited_user_entry:
                raise Exception(
                    "user with email {email} not found".format(email)
                )

            return InvitedUserDTO(
                invited_user_entry.id,
                invited_user_entry.email,
                invited_user_entry.role
            )
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_users(self):
        invited_user_dtos = []
        invited_user_list = [result for result in InvitedUsers.query.all()]
        for invited_user in invited_user_list:
            try:
                invited_user_dtos.append(InvitedUserDTO(
                    invited_user.id,
                    invited_user.email,
                    invited_user.role
                ))
            except Exception as e:
                self.logger.error(
                    "Failed to get all users"
                )
                raise e

        return invited_user_dtos

    def create_user(self, user):
        try:
            invited_user_entry = InvitedUsers.query.filter_by(email=user.email).first()

            if not invited_user_entry:
                postgres_invited_user = {
                    "email": user.email,
                    "role": user.role
                }

                invited_user_entry = InvitedUsers(**postgres_invited_user)
                db.session.add(invited_user_entry)
                db.session.commit()
        except Exception as e:
            db.session.rollback()
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def delete_user_by_id(self, user_id):
        try:
            deleted_user = InvitedUsers.query.get(user_id)

            if not deleted_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            delete_count = InvitedUsers.query.filter_by(id=user_id).delete(
                synchronize_session="fetch"
            )

            if delete_count < 1:
                raise Exception(
                    "user_id {user_id} was not deleted".format(user_id=user_id)
                )
            elif delete_count > 1:
                raise Exception(
                    "user_id {user_id} had multiple instances. Delete not committed.".format(
                        user_id=user_id
                    )
                )

            db.session.commit()

        except Exception as e:
            db.session.rollback()
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to delete user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def delete_user_by_email(self, email):
        try:
            deleted_user = InvitedUsers.query.filter_by(email=email).first()

            if not deleted_user:
                raise Exception(
                    "email {email} not found".format(email)
                )

            delete_count = InvitedUsers.query.filter_by(email=email).delete(
                synchronize_session="fetch"
            )

            if delete_count < 1:
                raise Exception(
                    "user with email {email} was not deleted".format(email)
                )
            elif delete_count > 1:
                raise Exception(
                    "user with email {email} had multiple instances. Delete not committed.".format(
                        email
                    )
                )

            db.session.commit()
        except Exception as e:
            db.session.rollback()
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to delete user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
        
    def send_email_sign_in_link(self, email):
        if not self.email_service:
            error_message = """
                Attempted to call send_email_verification_link but this instance of AuthService 
                does not have an EmailService instance
                """
            self.logger.error(error_message)
            raise Exception(error_message)

        try:
            email_body = """
                Hello,
                <br><br>
                Please click the following link to sign in your email and activate your account.
                <strong>This link is only valid for 1 hour.</strong>
                <br><br>
                <a href={sign_in_link}>Sign in here</a>
                """.format(
                sign_in_link="http://localhost:3000/login"
            )
            return self.email_service.send_email(email, "Sign in with your email", email_body)
        except Exception as e:
            self.logger.error(
                "Failed to generate email sign in link for user with email {email}.".format(
                    email=email
                )
            )
            raise e
