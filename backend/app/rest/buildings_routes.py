from flask import Blueprint, current_app, jsonify, request
from ..middlewares.auth import require_authorization_by_role
from ..services.implementations.buildings_service import BuildingsService

buildings_service = BuildingsService(current_app.logger)
blueprint = Blueprint("buildings", __name__, url_prefix="/buildings")

@blueprint.route("/", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"Relief Staff", "Regular Staff", "Admin"})
def get_buildings():
    """
    Get buildings.
    """
    try:
        building_results = buildings_service.get_buildings()
        return jsonify(building_results), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500