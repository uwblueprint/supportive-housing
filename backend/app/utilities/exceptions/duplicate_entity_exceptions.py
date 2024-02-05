class DuplicateTagException(Exception):
    """
    Raised when an duplicate tag is encountered
    """

    def __init__(self, tag_name):
        message = f"Tag with name {tag_name} already exists."
        super().__init__(message)


class DuplicateUserException(Exception):
    """
    Raised when an duplicate user is encountered
    """

    def __init__(self, email):
        message = f"User with email {email} already exists."
        super().__init__(message)

class DuplicateResidentException(Exception):
    """
    Raised when an duplicate resident is encountered
    """

    def __init__(self, resident_id):
        message = f"Resident with ID {resident_id} already exists."
        super().__init__(message)
