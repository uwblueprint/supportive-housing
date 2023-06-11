class CreateInvitedUserDTO:
    def __init__(self, **kwargs):
        self.email = kwargs.get("email")
        self.role = kwargs.get("role")

    def validate(self):
        error_list = []
        if type(self.email) is not str:
            error_list.append("The email supplied is not a string.")
        if type(self.role) is not str:
            error_list.append("The role supplied is not a string.")
        return error_list
