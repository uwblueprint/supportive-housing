import os

from flask import Blueprint, current_app, jsonify, request

from ..middlewares.auth import require_authorization_by_role
from ..middlewares.validate import validate_request
from ..resources.create_user_dto import CreateUserDTO
from ..resources.create_invited_user_dto import CreateInvitedUserDTO
from ..resources.update_user_dto import UpdateUserDTO
from ..resources.update_user_status_dto import UpdateUserStatusDTO
from ..services.implementations.auth_service import AuthService
from ..services.implementations.email_service import EmailService
from ..services.implementations.user_service import UserService
from ..utilities.csv_utils import generate_csv_from_list
from ..utilities.exceptions.auth_exceptions import UserNotInvitedException
from ..utilities.exceptions.duplicate_entity_exceptions import DuplicateUserException


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
    return_all = False
    try:
        return_all = (
            True if request.args.get("return_all").casefold() == "true" else False
        )
    except:
        pass

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
        users = user_service.get_users(return_all, page_number, results_per_page)
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
        numUsers = user_service.count_users()
        return jsonify(numUsers), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/user-status", methods=["GET"], strict_slashes=False)
def get_user_status():
    try:
        email = request.args.get("email")
        user_status = user_service.get_user_status_by_email(email)
        return jsonify({"user_status": user_status, "email": email}), 201
    except UserNotInvitedException as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 403
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("user-status/<int:user_id>", methods=["PATCH"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
@validate_request("UpdateUserStatusDTO")
def update_user_status(user_id):
    """
    Update the user with the specified status
    """
    try:
        body = UpdateUserStatusDTO(**request.json)
        user_service.update_user_status(user_id, body.user_status)
        return (
            jsonify(
                {
                    "message": "User record with id {user_id} updated sucessfully".format(
                        user_id=user_id
                    )
                }
            ),
            200,
        )
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
    except DuplicateUserException as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 409
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


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
        user_service.update_user_by_id(user_id, user)
        return (
            jsonify(
                {
                    "message": "User record with id {user_id} updated sucessfully".format(
                        user_id=user_id
                    )
                }
            ),
            201,
        )
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<int:user_id>", methods=["DELETE"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def delete_user(user_id):
    """
    Delete a user by user_id
    """

    try:
        user_service.delete_user_by_id(user_id)
        return (
            jsonify(
                {
                    "message": "User record with id {user_id} deleted sucessfully".format(
                        user_id=user_id
                    )
                }
            ),
            204,
        )
    except Exception as e:
        error_message = getattr(e, "message", None)
        return (
            jsonify({"error": (error_message if error_message else str(e))}),
            500,
        )
