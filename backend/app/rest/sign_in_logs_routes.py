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

    page_number = 1
    try:
        page_number = int(request.args.get("page_number"))
    except:
        pass

    results_per_page = 10
    try:
        results_per_page = int(request.args.get("results_per_page"))
    except:
        pass

    start_date = None
    end_date = None
    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
    except:
        pass

    if start_date and end_date:
        if start_date > end_date:
            return jsonify({"error": "start_date must be before end"}), 400
        
        try:
            # return as json object
            logs = sign_in_logs_service.get_sign_in_logs_by_date_range(
                page_number, results_per_page, start_date, end_date
            )
            return jsonify({"sign_in_logs": logs}), 200

        except Exception as e:
            error_message = getattr(e, "message", None)
            return (
                jsonify({"error": (error_message if error_message else str(e))}),
                500,
            )
    else:
        return jsonify({"error": "Not enough information provided."})
    
    # Commented out for possible future use

    # email = None
    # user_id = None
    # try:
    #     email = request.args.get("email")
    # except:
    #     pass

    # if email and start_date and end_date:
    #     try:
    #         logs = sign_in_logs_service.get_sign_in_logs_by_date_range_and_id(
    #             start_date, end_date, user_id
    #         )
    #         return jsonify({"sign_in_logs": logs}), 200
    #     except Exception as e:
    #         error_message = getattr(e, "message", None)
    #         return (
    #             jsonify({"error": (error_message if error_message else str(e))}),
    #             500,
    #         )
    # elif email and not (start_date and end_date):
    #     try:
    #         logs = sign_in_logs_service.get_sign_in_logs_by_id(user_id)
    #         return jsonify({"sign_in_logs": logs}), 200
    #     except Exception as e:
    #         error_message = getattr(e, "message", None)
    #         return (
    #             jsonify({"error": (error_message if error_message else str(e))}),
    #             500,
    #         )

@blueprint.route("/count", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def count_logs():

    start_date = None
    end_date = None
    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
    except:
        pass

    if start_date and end_date:
        if start_date > end_date:
            return jsonify({"error": "start_date must be before end"}), 400
        
        try:
            count = sign_in_logs_service.count_sign_in_logs_by_date_range(
                start_date, end_date
            )
            return jsonify({"num_results": count}), 200

        except Exception as e:
            error_message = getattr(e, "message", None)
            return (
                jsonify({"error": (error_message if error_message else str(e))}),
                500,
            )
    else:
        return jsonify({"error": "Not enough information provided."})
