class UserDTO:
    def __init__(
        self, id, first_name, last_name, email, role, user_status, last_modified
    ):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.role = role
        self.user_status = user_status
        self.last_modified = last_modified
