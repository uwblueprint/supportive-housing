from flask import Blueprint, current_app, jsonify, request
from ..middlewares.auth import require_authorization_by_role
from ..services.implementations.residents_service import ResidentsService
from ..utilities.exceptions.duplicate_entity_exceptions import (
    DuplicateResidentException,
)
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
    if residents_service.is_date_left_invalid_resident(resident):
        return (
            jsonify({"date_left_error": "date_left cannot be less than date_joined"}),
            400,
        )
    try:
        created_resident = residents_service.add_resident(resident)
        return jsonify(created_resident), 201

    except DuplicateResidentException as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 409
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<int:resident_id>", methods=["PUT"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def update_resident(resident_id):
    """
    Update an existing resident record based on the id
    """
    updated_resident = request.json
    if residents_service.is_date_left_invalid_resident(updated_resident):
        return (
            jsonify({"date_left_error": "date_left cannot be less than date_joined"}),
            400,
        )

    try:
        updated_resident = residents_service.update_resident(
            resident_id, updated_resident
        )
        return (
            jsonify(
                {
                    "message": "Tenant record with id {resident_id} updated sucessfully".format(
                        resident_id=resident_id
                    )
                }
            ),
            201,
        )
    except DuplicateResidentException as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 409
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
        return (
            jsonify(
                {
                    "message": "Resident with id {resident_id} deleted sucessfully".format(
                        resident_id=resident_id
                    )
                }
            ),
            201,
        )
    except Exception as e:
        error_message = getattr(e, "message", None)
        if "has existing log records" in str(e):
            return (
                jsonify(
                    {"existing_log_record_error": "Resident has existing log records"}
                ),
                400,
            )
        else:
            return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"Relief Staff", "Regular Staff", "Admin"})
def get_residents():
    """
    Get residents.
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

    filters = None
    try:
        filters = json.loads(request.args.get("filters"))
    except:
        pass

    results_per_page = 10
    try:
        results_per_page = int(request.args.get("results_per_page"))
    except:
        pass

    try:
        residents_results = residents_service.get_residents(
            return_all, page_number, results_per_page, filters
        )
        return jsonify(residents_results), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/count", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"Relief Staff", "Regular Staff", "Admin"})
def count_residents():
    """
    Get number of residents. Can optionally add filters
    """
    try:
        filters = json.loads(request.args.get("filters"))
    except:
        filters = None

    try:
        residents = residents_service.count_residents(filters)
        return jsonify(residents), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
