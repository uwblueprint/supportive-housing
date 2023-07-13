import os

from flask import Blueprint, current_app, jsonify, request

from ..middlewares.auth import require_authorization_by_role
from ..middlewares.validate import validate_request
from ..resources.create_user_dto import CreateUserDTO
from ..resources.create_invited_user_dto import CreateInvitedUserDTO
from ..resources.update_user_dto import UpdateUserDTO
from ..services.implementations.auth_service import AuthService
from ..services.implementations.email_service import EmailService
from ..services.implementations.user_service import UserService
from ..utilities.csv_utils import generate_csv_from_list


user_service = UserService(current_app.logger)
email_service = EmailService(
    current_app.logger,
    {
        "refresh_token": os.getenv("MAILER_REFRESH_TOKEN"),
        "token_uri": "https://oauth2.googleapis.com/token",
        "client_id": os.getenv("MAILER_CLIENT_ID"),
        "client_secret": os.getenv("MAILER_CLIENT_SECRET"),
    },
    os.getenv("MAILER_USER"),
    "Supportive Housing",  # must replace
)
auth_service = AuthService(current_app.logger, user_service, email_service)
blueprint = Blueprint("users", __name__, url_prefix="/users")

DEFAULT_CSV_OPTIONS = {
    "header": True,
    "flatten_lists": True,
    "flatten_objects": False,
}


@blueprint.route("/", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"Relief Staff", "Regular Staff", "Admin"})
def get_users():
    """
    Get RESULTS_PER_PAGE users. Will return the users of corresponding to the page you're on
    """
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

    try:
        users = user_service.get_users(page_number, results_per_page)
        return jsonify(users), 201

    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/count", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"Relief Staff", "Regular Staff", "Admin"})
def count_users():
    """
    Get number of users
    """
    try:
        log_records = user_service.count_users()
        return jsonify(log_records), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/user-status", methods=["GET"], strict_slashes=False)
def get_user_status():
    try:
        email = request.args.get("email")
        user_status = user_service.get_user_status_by_email(email)
        return jsonify({"user_status": user_status, "email": email}), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/invite-user", methods=["POST"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
@validate_request("CreateInvitedUserDTO")
def create_user():
    """
    Create a user
    """
    try:
        user = CreateInvitedUserDTO(**request.json)
        created_user = user_service.create_invited_user(user)
        return jsonify(created_user.__dict__), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        status_code = None
        if (str(e) == "User already exists"):
            status_code = 409
            
        return jsonify({"error": (error_message if error_message else str(e))}), (status_code if status_code else 500)


@blueprint.route("/activate-user", methods=["POST"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
@validate_request("CreateUserDTO")
def activate_user():
    """
    Activate a user
    """
    try:
        user = CreateUserDTO(**request.json)
        activated_user = user_service.activate_user(user)
        auth_service.send_email_verification_link(request.json["email"])
        return jsonify(activated_user.__dict__), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<int:user_id>", methods=["PUT"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
@validate_request("UpdateUserDTO")
def update_user(user_id):
    """
    Update the user with the specified user_id
    """
    try:
        user = UpdateUserDTO(**request.json)
        updated_user = user_service.update_user_by_id(user_id, user)
        return jsonify(updated_user.__dict__), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/", methods=["DELETE"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def delete_user():
    """
    Delete a user by user_id or email, specified through a query parameter
    """
    user_id = request.args.get("user_id")
    email = request.args.get("email")

    if user_id and email:
        return jsonify({"error": "Cannot delete by both user_id and email"}), 400

    if user_id:
        if type(user_id) is not str:
            return jsonify({"error": "user_id query parameter must be a string"}), 400
        else:
            try:
                user_service.delete_user_by_id(user_id)
                return "", 204
            except Exception as e:
                error_message = getattr(e, "message", None)
                return (
                    jsonify({"error": (error_message if error_message else str(e))}),
                    500,
                )

    if email:
        if type(email) is not str:
            return jsonify({"error": "email query parameter must be a string"}), 400
        else:
            try:
                user_service.delete_user_by_email(email)
                return "", 204
            except Exception as e:
                error_message = getattr(e, "message", None)
                return (
                    jsonify({"error": (error_message if error_message else str(e))}),
                    500,
                )

    return (
        jsonify({"error": "Must supply one of user_id or email as query parameter."}),
        400,
    )
