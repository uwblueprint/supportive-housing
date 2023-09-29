from datetime import datetime

from flask import Blueprint, current_app, jsonify, request
from ..middlewares.auth import require_authorization_by_role

from ..services.implementations.user_service import UserService
from ..services.implementations.sign_in_logs_service import SignInLogService

user_service = UserService(current_app.logger)
sign_in_logs_service = SignInLogService(current_app.logger)
blueprint = Blueprint("sign-in-logs", __name__, url_prefix="/sign-in-logs")


@blueprint.route("/", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def filter_logs():
    email = None
    start_date = None
    end_date = None
    try:
        email = request.args.get("email")
    except:
        pass

    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
    except:
        pass

    user_id = None

    if email:
        if type(email) is not str:
            return jsonify({"error": "email query parameter must be a string"}), 400
        else:
            try:
                user_id = user_service.get_user_by_email(email).id
            except Exception as e:
                error_message = getattr(e, "message", None)
                return (
                    jsonify({"error": (error_message if error_message else str(e))}),
                    500,
                )

    if start_date and end_date:
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d").replace(
                hour=23, minute=59
            )
        except Exception as e:
            return (
                jsonify({"error": "Date is not in correct format"}),
                500,
            )
        if start_date > end_date:
            return jsonify({"error": "start_date must be before end"}), 400

    if email and start_date and end_date:
        try:
            logs = sign_in_logs_service.get_sign_in_logs_by_date_range_and_id(
                start_date, end_date, user_id
            )
            return logs, 200
        except Exception as e:
            error_message = getattr(e, "message", None)
            return (
                jsonify({"error": (error_message if error_message else str(e))}),
                500,
            )
    elif email and not (start_date and end_date):
        try:
            logs = sign_in_logs_service.get_sign_in_logs_by_id(user_id)
            return logs, 200
        except Exception as e:
            error_message = getattr(e, "message", None)
            return (
                jsonify({"error": (error_message if error_message else str(e))}),
                500,
            )
    elif start_date and end_date:
        try:
            # return as json object
            logs = sign_in_logs_service.get_sign_in_logs_by_date_range(
                start_date, end_date
            )
            return logs, 200

        except Exception as e:
            error_message = getattr(e, "message", None)
            return (
                jsonify({"error": (error_message if error_message else str(e))}),
                500,
            )
    else:
        return jsonify({"error": "Not enough information provided."})
