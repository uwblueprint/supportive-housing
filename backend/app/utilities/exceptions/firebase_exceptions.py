class InvalidPasswordException(Exception):
    """
    Raised when an invalid password is entered
    """
    def __init__(self, message="INVALID_PASSWORD"):
      self.message = message
      super().__init__(self.message)

class TooManyLoginAttemptsException(Exception):
    """
    Raised when there have been too many failed attempts to login 
    """
    def __init__(self, message="TOO_MANY_ATTEMPTS_TRY_LATER"):
      self.message = message
      super().__init__(self.message)

