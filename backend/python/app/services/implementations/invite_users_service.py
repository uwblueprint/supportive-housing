
from ..interfaces.invite_users_service import IInviteUserService
from ...models.invited_users import InvitedUsers
from ...models import db
from ...resources.invited_user_dto import InvitedUserDTO


class InviteUserService(IInviteUserService):
    """
    InviteUserService interface with methods to manage invited users
    """

    def __init__(self, logger):
        """
        Create an instance of InviteUserService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

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

    def create_user(self, user, auth_id=None, signup_method="PASSWORD"):
        new_user = None
        firebase_user = None

        try:
            postgres_invited_user = {
                "email": user.email,
                "role": user.role
            }

            new_invited_user = InvitedUsers(**postgres_invited_user)
            db.session.add(new_invited_user)
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

        return InvitedUserDTO(
            new_invited_user.id,
            new_invited_user.email,
            new_invited_user.role
        )

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