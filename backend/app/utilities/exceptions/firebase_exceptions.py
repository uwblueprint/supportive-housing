class InvalidPasswordException(Exception):
    """
    Raised when an invalid password is entered
    """
    def __init__(self, message="Failed to sign-in via Firebase REST API"):
      self.message = message
      super().__init__(self.message)
