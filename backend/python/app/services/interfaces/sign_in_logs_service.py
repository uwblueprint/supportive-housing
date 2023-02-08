from abc import ABC, abstractmethod


class ISignInLogService(ABC):
    """
    SignInLog interface with log management methods
    """

    @abstractmethod
    def create_log(self, user_id):
        """
        Create a user, email verification configurable

        :param user: the user to be created
        :type user: CreateUserDTO
        :param auth_id: user's firebase auth id, defaults to None
        :type auth_id: string, optional
        :param signup_method: method of signup, either "PASSWORD" or "GOOGLE", defaults to "PASSWORD"
        :type signup_method: str, optional
        :return: the created user
        :rtype: UserDTO
        :raises Exception: if user creation fails
        """
        pass