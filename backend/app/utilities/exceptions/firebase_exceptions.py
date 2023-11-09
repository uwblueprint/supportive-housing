class InvalidPasswordException(Exception):
    """
    Raised when an invalid password is entered
    """

    def __init__(self):
        self.message = "Incorrect password. Please try again."
        super().__init__(self.message)


class TooManyLoginAttemptsException(Exception):
    """
    Raised when there have been too many failed attempts to login
    """

    def __init__(self):
        self.message = "Too many failed login attempts. Please try again later."
        super().__init__(self.message)
