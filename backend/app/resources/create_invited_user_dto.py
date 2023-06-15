class CreateInvitedUserDTO:
    def __init__(self, **kwargs):
        self.email = kwargs.get("email")
        self.role = kwargs.get("role")
        self.first_name = kwargs.get("first_name")
        self.last_name = kwargs.get("last_name")

    def validate(self):
        error_list = []
        if type(self.email) is not str:
            error_list.append("The email supplied is not a string.")
        if self.role not in ["Admin", "Relief Staff", "Regular Staff"]:
            error_list.append("The role supplied is not valid.")
        if type(self.first_name) is not str:
            error_list.append("The first_name supplied is not a string.")
        if type(self.last_name) is not str:
            error_list.append("The last_name supplied is not a string")
        return error_list
