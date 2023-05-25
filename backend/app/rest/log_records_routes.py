from flask import Blueprint, current_app, jsonify, request
from ..middlewares.auth import require_authorization_by_role

from ..services.implementations.log_records_service import LogRecordsService
from ..services.implementations.user_service import UserService

import json

log_records_service = LogRecordsService(current_app.logger)
user_service = UserService(current_app.logger)

blueprint = Blueprint("log_records", __name__, url_prefix="/log_records")


@blueprint.route("/", methods=["POST"], strict_slashes=False)
#@require_authorization_by_role({"Relief Staff", "Regular Staff", "Admin"})
def add_log_record():
    """
    Add a log record
    """
    log_record = request.json
    try:
        created_log = log_records_service.add_record(log_record)
        return jsonify(created_log), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/", methods=["GET"], strict_slashes=False)
#@require_authorization_by_role({"Relief Staff", "Regular Staff", "Admin"})
def get_log_records():
    """
    Get RESULTS_PER_PAGE log records. Will return the log records of corresponding to the page you're on. Can optionally add filters.
    """
    page_number = 1
    return_all = ""
    try:
        page_number = int(request.args.get("page_number"))
    except:
        return_all = True if request.args.get("return_all").casefold() == "true" else False
        pass

    try:
        filters = json.loads(request.args.get("filters"))
        log_records = []

        if return_all:
            log_records = log_records_service.get_log_records(filters=filters, return_all=return_all)
        else:
            log_records = log_records_service.get_log_records(page_number, filters)
            
        return jsonify(log_records), 201
    except Exception as e:
        try:
            if return_all:
                log_records = log_records_service.get_log_records(return_all=return_all)
            else:
                log_records = log_records_service.get_log_records(page_number)

            return jsonify(log_records), 201
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<int:delete_id>", methods=["DELETE"], strict_slashes=False)
@require_authorization_by_role({"Relief Staff", "Regular Staff", "Admin"})
def delete_log_record(delete_id):
    """
    Delete a log based on log id
    """

    try:
        log_records_service.delete_log_record(delete_id)
        return (
            jsonify(
                {
                    "message": "Log record with id {delete_id} deleted sucessfully".format(
                        delete_id=delete_id
                    )
                }
            ),
            201,
        )
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<int:log_id>", methods=["PUT"], strict_slashes=False)
@require_authorization_by_role({"Relief Staff", "Regular Staff", "Admin"})
def update_log_record(log_id):
    """
    Update a log based on log id
    """
    updated_log_record = request.json

    try:
        updated_log_record = log_records_service.update_log_record(
            log_id, updated_log_record
        )
        return (
            jsonify(
                {
                    "message": "Log record with id {log_id} updated sucessfully".format(
                        log_id=log_id
                    )
                }
            ),
            201,
        )
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
