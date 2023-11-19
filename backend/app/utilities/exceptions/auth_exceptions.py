class UserNotInvitedException(Exception):
    """
    Raised when a user that has not been invited attempts to register
    """

    def __init__(self):
        self.message = "This email address has not been invited. Please try again with a different email."
        super().__init__(self.message)
