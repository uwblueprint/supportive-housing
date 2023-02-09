import os
from sqlalchemy import select
from datetime import datetime
import json


from flask import Blueprint, current_app, jsonify, request
from ..middlewares.auth import require_authorization_by_role

from ..services.implementations.user_service import UserService
from ..services.implementations.sign_in_logs_service import SignInLogService

user_service = UserService(current_app.logger)
sign_in_logs_service = SignInLogService(current_app.logger)
blueprint = Blueprint("logs", __name__, url_prefix="/logs")

@blueprint.route("/", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def filter_logs():
    email = request.json["email"]
    start_date = request.json["start_date"]
    end_date = request.json["end_date"]
    
    if email and (start_date and end_date):
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59)
        if type(email) is not str or (type(start_date) is not datetime or type(end_date) is not datetime):
            return jsonify({"error": "start_date and end_date query parameter must be datetime and email must be a string"}), 400
        elif (start_date > end_date):
            return jsonify({"error": "start_date must be before end_dateg"}), 400
        try:
            user_id = user_service.get_user_by_email(email).id
            logs = sign_in_logs_service.get_logs_by_date_range_and_id(start_date, end_date, user_id)
            logs_list = sign_in_logs_service.get_logs_list(logs)
            return logs_list, 200
        except Exception as e:
            error_message = getattr(e, "message", None)
            return (
                jsonify({"error": (error_message if error_message else str(e))}),
                500,
            )
    elif email and not(start_date or end_date): 
        if type(email) is not str:
            return jsonify({"error": "email query parameter must be a string"}), 400
        else:
            try:
                user_id = user_service.get_user_by_email(email).id
                logs = sign_in_logs_service.get_logs_by_id(user_id)
                logs_list = sign_in_logs_service.get_logs_list(logs)
                return logs_list, 200
            except Exception as e:
                error_message = getattr(e, "message", None)
                return (
                    jsonify({"error": (error_message if error_message else str(e))}),
                    500,
                )
    elif (start_date and end_date):
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59)

        if type(start_date) is not datetime or type(end_date) is not datetime:
            return jsonify({"error": "start_date and end_date query parameter must be datetime"}), 400
        elif (start_date > end_date):
            return jsonify({"error": "start_date must be before end_dateg"}), 400
        try:
            # return as json object
            logs = sign_in_logs_service.get_logs_by_date_range(start_date, end_date)
            logs_list = sign_in_logs_service.get_logs_list(logs)       
            return logs_list, 200

        except Exception as e:
            error_message = getattr(e, "message", None)
            return (
            jsonify({"error": (error_message if error_message else str(e))}),500,)
    else:
        return jsonify({"error": "Not enough information provided."})