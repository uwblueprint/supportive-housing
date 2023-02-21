from abc import ABC, abstractmethod


class IInviteUserService(ABC):
    """
    InviteUserService interface with methods to manage invited users
    """

    @abstractmethod
    def get_user_by_id(self, user_id):
        """
        Get invited user associated with user_id

        :param user_id: user's id
        :type user_id: str
        :return: an InvitedUserDTO with user's information
        :rtype: InvitedUserDTO
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def get_user_by_email(self, email):
        """
        Get invited user associated with email

        :param email: invited user's email
        :type email: str
        :return: a InvitedUserDTO with user's information
        :rtype: UserDTO
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def get_users(self):
        """
        Get all users (possibly paginated in the future)

        :return: list of UserDTOs
        :rtype: [UserDTO]
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def create_user(self, user):
        """
        Create an invited user entry in table

        :param user: the user to be created
        """
        pass

    @abstractmethod
    def delete_user_by_id(self, user_id):
        """
        Delete an invited user by user_id

        :param user_id: user_id of user to be deleted
        :type user_id: str
        :raises Exception: if user deletion fails
        """
        pass

    @abstractmethod
    def delete_user_by_email(self, email):
        """
        Delete an invited user by email

        :param str email: email of user to be deleted
        :type email: str
        :raises Exception: if user deletion fails
        """
        pass
