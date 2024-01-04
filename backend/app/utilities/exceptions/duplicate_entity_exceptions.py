class DuplicateTagException(Exception):
    """
    Raised when an duplicate tag is encountered
    """

    def __init__(self, tag_name):
        message = f"Tag with name {tag_name} already exists."
        super().__init__(message)
