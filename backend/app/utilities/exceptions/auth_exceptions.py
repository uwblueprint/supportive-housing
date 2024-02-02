class UserNotInvitedException(Exception):
    """
    Raised when a user that has not been invited attempts to register
    """

    def __init__(self):
        self.message = "This email address has not been invited. Please try again with a different email."
        super().__init__(self.message)

class UserNotFoundException(Exception):
    """
    Raised when a user is not found in the database by email
    """

    def __init__(self):
        self.message = "This email address does not exist."
        super().__init__(self.message)

class UserNotActiveException(Exception):
    """
    Raised when a user does not have a user status of Active
    """

    def __init__(self):
        self.message = "This email address is not currently active."
        super().__init__(self.message)


class EmailAlreadyInUseException(Exception):
    """
    Raised when a user attempts to register with an email of a previously activated user
    """

    def __init__(self):
        self.message = (
            "This email is already in use. Please try again with a different email."
        )
        super().__init__(self.message)
