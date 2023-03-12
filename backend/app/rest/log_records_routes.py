from flask import Blueprint, current_app, jsonify, request
from ..middlewares.auth import require_authorization_by_role

from ..services.implementations.log_records_service import LogRecordsService

log_records_service = LogRecordsService(current_app.logger)
blueprint = Blueprint("log_records", __name__, url_prefix="/log_records")


@blueprint.route("/add", methods=["POST"], strict_slashes=False)
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


@blueprint.route("/get", methods=["GET"], strict_slashes=False)
def get_log_records():
    """
    Get all existing log records or input a start and end index of logs retrieved
    """
    start_index = None
    end_index = None

    try:
        start_index = request.json["start_index"]
        end_index = request.json["end_index"]
    except:
        pass

    try:
        if (start_index and end_index and start_index <= end_index):
            log_records = log_records_service.get_log_records(
                start_index, end_index+1)
        else:
            log_records = log_records_service.get_log_records()
        return log_records, 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/delete/<int:delete_id>", methods=["DELETE"], strict_slashes=False)
def delete_log_record(delete_id):
    """
    Delete a log based on log id 
    """

    try:
        log_records_service.delete_log_record(delete_id)
        return jsonify({"message": "Log record with id {delete_id} deleted sucessfully".format(delete_id=delete_id)}), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

@blueprint.route("/update/<int:log_id>", methods=["PUT"], strict_slashes=False)
def update_log_record(log_id):
    """
    Update a log based on log id 
    """
    updated_log_record = request.json
    try:
        updated_log_record = log_records_service.update_log_record(log_id, updated_log_record)
        return jsonify({"message": "Log record with id {log_id} updated sucessfully".format(log_id=log_id)}), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
