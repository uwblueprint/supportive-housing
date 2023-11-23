import firebase_admin.auth

from ..interfaces.user_service import IUserService
from ...models.user import User
from ...models import db
from ...resources.user_dto import UserDTO
from ...utilities.exceptions.auth_exceptions import (
  UserNotInvitedException, EmailAlreadyInUseException
)


class UserService(IUserService):
    """
    UserService implementation with user management methods
    """

    def __init__(self, logger):
        """
        Create an instance of UserService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def get_user_by_id(self, user_id):
        try:
            user = User.query.get(user_id)

            if not user:
                raise Exception("user_id {user_id} not found".format(user_id))

            firebase_user = firebase_admin.auth.get_user(user.auth_id)

            user_dict = UserService.__user_to_dict_and_remove_auth_id(user)
            user_dict["email"] = firebase_user.email

            return UserDTO(**user_dict)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user by id. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_by_email(self, email):
        try:
            firebase_user = firebase_admin.auth.get_user_by_email(email)
            user = User.query.filter_by(auth_id=firebase_user.uid).first()

            if not user:
                raise Exception(
                    "user with auth_id {auth_id} not found".format(
                        auth_id=firebase_user.uid
                    )
                )

            user_dict = UserService.__user_to_dict_and_remove_auth_id(user)
            user_dict["email"] = firebase_user.email

            return UserDTO(**user_dict)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user by email. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_role_by_auth_id(self, auth_id):
        try:
            user = self.__get_user_by_auth_id(auth_id)
            return user.role
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user role. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_id_by_auth_id(self, auth_id):
        try:
            user = self.__get_user_by_auth_id(auth_id)
            return str(user.id)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user id. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_auth_id_by_user_id(self, user_id):
        try:
            user = User.query.get(user_id)

            if not user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            return user.auth_id
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "failed to get auth_id. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_users(self, return_all, page_number, results_per_page):
        try:
            if return_all:
                users = User.query.order_by(User.last_modified.desc()).all()
            else:
                users = (
                    User.query.order_by(User.last_modified.desc())
                    .limit(results_per_page)
                    .offset((page_number - 1) * results_per_page)
                    .all()
                )

            json_list = list(
                map(
                    lambda user: UserService.__user_to_dict_and_remove_auth_id(user),
                    users,
                )
            )
            return {"users": json_list}

        except Exception as postgres_error:
            raise postgres_error

    def count_users(self):
        try:
            count = User.query.count()

            return {"num_results": count}

        except Exception as postgres_error:
            raise postgres_error

    def get_user_status_by_email(self, email):
        try:
            user = User.query.filter_by(email=email).first()

            if not user:
                raise UserNotInvitedException

            return user.user_status
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user status. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def update_user_status(self, user_id, user_status):
        try:
            User.query.filter_by(id=user_id).update(
                {
                    User.user_status: user_status,
                }
            )
            db.session.commit()
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to update user status. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def create_invited_user(self, user):
        try:
            user_entry = User.query.filter_by(email=user.email).first()

            if not user_entry:
                postgres_invited_user = {
                    "role": user.role,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "user_status": "Invited",
                    "email": user.email,
                }

                user_entry = User(**postgres_invited_user)
                db.session.add(user_entry)
                db.session.commit()
            else:
                raise Exception("User already exists")
            user_dict = UserService.__user_to_dict_and_remove_auth_id(user_entry)

            return UserDTO(**user_dict)
        except Exception as e:
            db.session.rollback()
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create invited user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def activate_user(self, user, auth_id=None, signup_method="PASSWORD"):
        firebase_user = None

        try:
            cur_user_status = self.get_user_status_by_email(user.email)
            
            if cur_user_status == "Active":
                raise EmailAlreadyInUseException
            if cur_user_status == "Invited":
                if signup_method == "PASSWORD":
                    firebase_user = firebase_admin.auth.create_user(
                        email=user.email, password=user.password
                    )
                elif signup_method == "GOOGLE":
                    # If they signup with Google OAuth, a Firebase user is automatically created
                    firebase_user = firebase_admin.auth.get_user(uid=auth_id)

                try:
                    User.query.filter_by(email=user.email).update(
                        {User.auth_id: firebase_user.uid, User.user_status: "Active"}
                    )
                    db.session.commit()
                    user_entry = User.query.filter_by(email=user.email).first()

                except Exception as postgres_error:
                    # rollback user creation in Firebase
                    try:
                        firebase_admin.auth.delete_user(firebase_user.uid)
                    except Exception as firebase_error:
                        reason = getattr(firebase_error, "message", None)
                        error_message = [
                            "Failed to rollback Firebase user creation after PostgreSQL user creation failed.",
                            "Reason = {reason},".format(
                                reason=(reason if reason else str(firebase_error))
                            ),
                            "Orphaned auth_id (Firebase uid) = {auth_id}".format(
                                auth_id=firebase_user.uid
                            ),
                        ]
                        self.logger.error(" ".join(error_message))
                    raise postgres_error

        except Exception as e:
            db.session.rollback()
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
        user_entry_dict = UserService.__user_to_dict_and_remove_auth_id(user_entry)
        return UserDTO(**user_entry_dict)

    def update_user_by_id(self, user_id, user):
        try:
            old_user = User.query.get(user_id)

            if not old_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            User.query.filter_by(id=user_id).update(
                {
                    User.first_name: user.first_name,
                    User.last_name: user.last_name,
                    User.role: user.role,
                }
            )

            db.session.commit()

            # Will need to uncomment this if the email needs to be updated at some point

            # try:
            #     if old_user.auth_id is not None:
            #         firebase_admin.auth.update_user(old_user.auth_id, email=user.email)
            # except Exception as firebase_error:
            #     try:
            #         old_user_dict = {
            #             User.first_name: old_user.first_name,
            #             User.last_name: old_user.last_name,
            #             User.role: old_user.role,
            #         }
            #         User.query.filter_by(id=user_id).update(**old_user_dict)
            #         db.session.commit()

            #     except Exception as postgres_error:
            #         reason = getattr(postgres_error, "message", None)
            #         error_message = [
            #             "Failed to rollback Postgres user update after Firebase user update failure.",
            #             "Reason = {reason},".format(
            #                 reason=(reason if reason else str(postgres_error))
            #             ),
            #             "Postgres user id with possibly inconsistent data = {user_id}".format(
            #                 user_id=user_id
            #             ),
            #         ]
            #         self.logger.error(" ".join(error_message))

            #     raise firebase_error

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to update user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def delete_user_by_id(self, user_id):
        try:
            deleted_user = User.query.get(user_id)

            if not deleted_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            delete_count = User.query.filter_by(id=user_id).delete(
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

            try:
                if deleted_user.auth_id is not None:
                    firebase_admin.auth.delete_user(deleted_user.auth_id)
            except Exception as firebase_error:
                # rollback Postgres user deletion
                try:
                    deleted_user_dict = {
                        "first_name": deleted_user.first_name,
                        "last_name": deleted_user.last_name,
                        "auth_id": deleted_user.auth_id,
                        "role": deleted_user.role,
                    }

                    new_user = User(**deleted_user_dict)
                    db.session.add(new_user)
                    db.session.commit()

                except Exception as postgres_error:
                    reason = getattr(postgres_error, "message", None)
                    error_message = [
                        "Failed to rollback Postgres user deletion after Firebase user deletion failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(postgres_error)),
                        ),
                        "Firebase uid with non-existent Postgres record ={auth_id}".format(
                            auth_id=deleted_user.auth_id
                        ),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to delete user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def __get_user_by_auth_id(self, auth_id):
        """
        Get a user document by auth_id

        :param auth_id: the user's auth_id (Firebase uid)
        :type auth_id: str
        """
        user = User.query.filter_by(auth_id=auth_id).first()

        if not user:
            raise Exception(
                "user with auth_id {auth_id} not found".format(auth_id=auth_id)
            )

        return user

    @staticmethod
    def __user_to_dict_and_remove_auth_id(user):
        """
        Convert a User document to a serializable dict and remove the
        auth id field

        :param user: the user
        :type user: User
        """
        user_dict = user.to_dict()
        user_dict.pop("auth_id", None)
        return user_dict
