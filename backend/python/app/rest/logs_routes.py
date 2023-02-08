import os
from sqlalchemy import select

from flask import Blueprint, current_app, jsonify, request
from ..middlewares.auth import require_authorization_by_role

from ..services.implementations.user_service import UserService
from ..services.implementations.sign_in_logs_service import SignInLogService

user_service = UserService(current_app.logger)
sign_in_logs_service = SignInLogService(current_app.logger)
blueprint = Blueprint("logs", __name__, url_prefix="/logs")

@blueprint.route("/", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def filter_logs():
    email = request.args.get("email")
    #what happens if wrong email?
   

    #if email + time period 

    
    if email: 
        if type(email) is not str:
            return jsonify({"error": "email query parameter must be a string"}), 400
        else:
            try:
                user_id = user_service.get_user_by_email(email).id
                logs = sign_in_logs_service.get_logs_by_id(user_id)
                print("this is logs", logs)
            except Exception as e:
                error_message = getattr(e, "message", None)
                return (
                    jsonify({"error": (error_message if error_message else str(e))}),
                    500,
                )


        #sql query
   
    #jus time