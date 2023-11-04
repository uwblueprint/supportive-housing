import os
from ..utilities.exceptions.firebase_exceptions import (
    InvalidPasswordException, 
    TooManyLoginAttemptsException
)

from flask import Blueprint, current_app, jsonify, request
from twilio.rest import Client

from ..middlewares.auth import (
    require_authorization_by_user_id,
    require_authorization_by_email,
)
from ..middlewares.validate import validate_request
from ..resources.create_user_dto import CreateUserDTO
from ..services.implementations.auth_service import AuthService
from ..services.implementations.email_service import EmailService
from ..services.implementations.user_service import UserService
from ..services.implementations.sign_in_logs_service import SignInLogService

user_service = UserService(current_app.logger)
sign_in_logs_service = SignInLogService(current_app.logger)
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

cookie_options = {
    "httponly": True,
    "samesite": ("None" if os.getenv("PREVIEW_DEPLOY") else "Strict"),
    "secure": (os.getenv("FLASK_CONFIG") == "production"),
    "max_age": 24 * 60 * 60,  # persist for 24 hours
}

blueprint = Blueprint("auth", __name__, url_prefix="/auth")

client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))


@blueprint.route("/login", methods=["POST"], strict_slashes=False)
def login():
    """
    Returns access token in response body and sets refreshToken as an httpOnly cookie only
    Also includes whether the user needs 2FA or not
    """
    try:
        auth_dto = None
        if "id_token" in request.json:
            auth_dto = auth_service.generate_token_for_oauth(request.json["id_token"])
        else:
            auth_dto = auth_service.generate_token(
                request.json["email"], request.json["password"]
            )
        response = {"requires_two_fa": False, "auth_user": None}

        if os.getenv("TWILIO_ENABLED") == "True" and auth_dto.role == "Relief Staff":
            response["requires_two_fa"] = True
            return jsonify(response), 200

        response["auth_user"] = {
            "access_token": auth_dto.access_token,
            "id": auth_dto.id,
            "first_name": auth_dto.first_name,
            "last_name": auth_dto.last_name,
            "email": auth_dto.email,
            "role": auth_dto.role,
        }

        sign_in_logs_service.create_sign_in_log(auth_dto.id)

        response = jsonify(response)
        response.set_cookie(
            "refreshToken",
            value=auth_dto.refresh_token,
            **cookie_options,
        )
        return response, 200
    except (InvalidPasswordException, TooManyLoginAttemptsException) as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/twoFa", methods=["POST"], strict_slashes=False)
def two_fa():
    """
    Validated passcode with Authy client and if successful,
    returns access token in response body and sets refreshToken as an httpOnly cookie only
    """

    passcode = request.args.get("passcode")

    if not passcode:
        return (
            jsonify({"error": "Must supply passcode as a query parameter.t"}),
            400,
        )

    try:
        challenge = (
            client.verify.v2.services(os.getenv("TWILIO_SERVICE_SID"))
            .entities(os.getenv("TWILIO_ENTITY_ID"))
            .challenges.create(
                auth_payload=passcode, factor_sid=os.getenv("TWILIO_FACTOR_SID")
            )
        )

        if challenge.status != "approved":
            return (
                jsonify({"error": "Invalid passcode."}),
                400,
            )

        auth_dto = None
        if "id_token" in request.json:
            auth_dto = auth_service.generate_token_for_oauth(request.json["id_token"])
        else:
            auth_dto = auth_service.generate_token(
                request.json["email"], request.json["password"]
            )
        response = jsonify(
            {
                "access_token": auth_dto.access_token,
                "id": auth_dto.id,
                "first_name": auth_dto.first_name,
                "last_name": auth_dto.last_name,
                "email": auth_dto.email,
                "role": auth_dto.role,
            }
        )
        response.set_cookie(
            "refreshToken",
            value=auth_dto.refresh_token,
            **cookie_options,
        )
        sign_in_logs_service.create_sign_in_log(auth_dto.id)
        return response, 200

    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/register", methods=["POST"], strict_slashes=False)
@validate_request("RegisterUserDTO")
def register():
    """
    Returns access token and user info in response body and sets refreshToken as an httpOnly cookie
    Also includes whether the user needs 2FA or not
    """
    try:
        user = CreateUserDTO(**request.json)
        user_service.activate_user(user)
        auth_dto = auth_service.generate_token(
            request.json["email"], request.json["password"]
        )

        auth_service.send_email_verification_link(request.json["email"])

        response = {"requires_two_fa": False, "auth_user": None}

        if os.getenv("TWILIO_ENABLED") == "True" and auth_dto.role == "Relief Staff":
            response["requires_two_fa"] = True
            return jsonify(response), 200

        response["auth_user"] = {
            "access_token": auth_dto.access_token,
            "id": auth_dto.id,
            "first_name": auth_dto.first_name,
            "last_name": auth_dto.last_name,
            "email": auth_dto.email,
            "role": auth_dto.role,
        }

        response = jsonify(response)
        response.set_cookie(
            "refreshToken",
            value=auth_dto.refresh_token,
            **cookie_options,
        )
        return response, 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/refresh", methods=["POST"], strict_slashes=False)
def refresh():
    """
    Returns access token in response body and sets refreshToken as an httpOnly cookie
    """
    try:
        token = auth_service.renew_token(request.cookies.get("refreshToken"))
        response = jsonify({"access_token": token.access_token})
        response.set_cookie(
            "refreshToken",
            value=token.refresh_token,
            **cookie_options,
        )
        return response, 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/logout/<string:user_id>", methods=["POST"], strict_slashes=False)
def logout(user_id):
    """
    Revokes all of the specified user's refresh tokens
    """
    try:
        auth_service.revoke_tokens(user_id)
        return "", 204
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route(
    "/resetPassword/<string:email>", methods=["POST"], strict_slashes=False
)
@require_authorization_by_email("email")
def reset_password(email):
    """
    Triggers password reset for user with specified email (reset link will be emailed)
    """
    try:
        auth_service.reset_password(email)
        return "", 204
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
