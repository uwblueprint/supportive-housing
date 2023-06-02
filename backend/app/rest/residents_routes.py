from flask import Blueprint, current_app, jsonify, request
from ..middlewares.auth import require_authorization_by_role
from ..services.implementations.residents_service import ResidentsService
import json

residents_service = ResidentsService(current_app.logger)
blueprint = Blueprint("residents", __name__, url_prefix="/residents")


@blueprint.route("/", methods=["POST"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def add_resident():
    """
    Add a resident
    """
    resident = request.json
    try:
        created_resident = residents_service.add_resident(resident)
        return jsonify(created_resident), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
    
#resident_id is the primary key in the table
@blueprint.route("/<int:resident_id>", methods=["PUT"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def update_resident(resident_id):
    """
    Update an existing resident record based on the id 
    """
    updated_resident = request.json
    try:
     updated_resident = residents_service.update_resident(resident_id, updated_resident)
     return jsonify({"message": "Resident record with id {resident_id} updated sucessfully".format(resident_id=resident_id)}), 201 
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
    
@blueprint.route("/<int:resident_id>", methods=["DELETE"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def delete_resident(resident_id):
    """
    Delete a resident record based on id 
    """
    try:
        residents_service.delete_resident(resident_id)
        return jsonify({"message": "Resident with id {resident_id} deleted sucessfully".format(resident_id=resident_id)}), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500     

@blueprint.route("/", methods=["GET"], strict_slashes=False)
def get_resident():
    """
    Get residents.
    """ 
    try:
        resident_id = request.args.get("resident_id")
        id = request.args.get("id")
        residents_results = residents_service.get_resident(resident_id, id)  
        return jsonify(residents_results), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    