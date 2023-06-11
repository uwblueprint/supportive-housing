import os

from flask import Blueprint, current_app, jsonify, request

# from ..middlewares.auth import require_authorization_by_role
from ..middlewares.validate import validate_request
from ..resources.create_invited_user_dto import CreateInvitedUserDTO
from ..services.implementations.invite_users_service import InviteUserService
from ..services.implementations.email_service import EmailService


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
invited_user_service = InviteUserService(current_app.logger, email_service)

blueprint = Blueprint("invite-users", __name__, url_prefix="/invite-users")

@blueprint.route("/", methods=["GET"], strict_slashes=False)
# @require_authorization_by_role({"Admin"})
def get_users():
    """
    Get all users, optionally filter by a user_id or email query parameter to retrieve a single user
    """
    user_id = request.args.get("user_id")
    email = request.args.get("email")

    if user_id and email:
        return jsonify({"error": "Cannot query by both user_id and email"}), 400

    if not (user_id or email):
        try:
            invited_users = invited_user_service.get_users()

            return jsonify(list(map(lambda invited_user: invited_user.__dict__, invited_users))), 200
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500

    if user_id:
        if type(user_id) is not str:
            return jsonify({"error": "user_id query parameter must be a string"}), 400
        else:
            try:
                invited_user = invited_user_service.get_user_by_id(user_id)
                return jsonify(invited_user.__dict__), 200
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
                invited_user = invited_user_service.get_user_by_email(email)
                return jsonify(invited_user.__dict__), 200
            except Exception as e:
                error_message = getattr(e, "message", None)
                return (
                    jsonify({"error": (error_message if error_message else str(e))}),
                    500,
                )


@blueprint.route("/", methods=["POST"], strict_slashes=False)
# @require_authorization_by_role({"Admin"})
@validate_request("CreateInvitedUserDTO")
def create_user():
    """
    Create an invited user
    """
    try:
        invited_user = CreateInvitedUserDTO(**request.json)
        created_invited_user = invited_user_service.create_user(invited_user)
        invited_user_service.send_email_sign_in_link(invited_user.email)
        return jsonify(created_invited_user.__dict__), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/", methods=["DELETE"], strict_slashes=False)
# @require_authorization_by_role({"Admin"})
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
                invited_user_service.delete_user_by_id(user_id)
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
                invited_user_service.delete_user_by_email(email)
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
