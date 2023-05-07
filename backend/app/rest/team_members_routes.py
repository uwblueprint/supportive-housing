from flask import Blueprint, current_app, jsonify, request
from ..middlewares.auth import require_authorization_by_role
from ..services.implementations.team_members_service import TeamMembersService
import json

team_members_service = TeamMembersService(current_app.logger)
blueprint = Blueprint("team_members", __name__, url_prefix="/team_members")


@blueprint.route("/", methods=["POST"], strict_slashes=False)
#@require_authorization_by_role({"Admin"})
def add_team_member():
    """
    Add a team member
    """
    team_member = request.json
    try:
        created_member = team_members_service.add_team_member(team_member)
        return jsonify(created_member), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500  

@blueprint.route("/", methods=["GET"], strict_slashes=False)
def get_team_member():
    """
    Get team members.
    """ 
    try:
        team_members_results = team_members_service.get_member()  
        return jsonify(team_members_results), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    