class UpdateUserStatusDTO:
    def __init__(self, **kwargs):
        self.user_status = kwargs.get("user_status")

    def validate(self):
        error_list = []
        if type(self.user_status) is not str:
            error_list.append("The user_status supplied is not a string.")
        if self.user_status not in ("Invited", "Active", "Deactivated"):
            error_list.append("The user_status supplied is invalid.")
        return error_list
