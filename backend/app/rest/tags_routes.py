from flask import Blueprint, current_app, jsonify, request
from ..middlewares.auth import require_authorization_by_role
from ..services.implementations.tags_service import TagsService

tags_service = TagsService(current_app.logger)
blueprint = Blueprint("tags", __name__, url_prefix="/tags")


@blueprint.route("/", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def get_tags():
    """
    Get tags.
    """
    try:
        tags_results = tags_service.get_tags()
        return jsonify(tags_results), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<int:tag_id>", methods=["DELETE"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def delete_tag(tag_id):
    """
    Delete a tag based on tag id
    """
    try:
        tags_service.delete_tag(tag_id)
        return (
            jsonify(
                {
                    "message": "Tag with id {tag_id} deleted sucessfully".format(
                        tag_id=tag_id
                    )
                }
            ),
            201,
        )
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<int:tag_id>", methods=["PUT"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def update_tag(tag_id):
    """
    Update a tag based on tag id
    """
    updated_tag_record = request.json
    try:
        updated_tag_record = tags_service.update_tag(tag_id, updated_tag_record)
        return (
            jsonify(
                {
                    "message": "Tag with id {tag_id} updated sucessfully".format(
                        tag_id=tag_id
                    )
                }
            ),
            201,
        )
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/", methods=["POST"], strict_slashes=False)
@require_authorization_by_role({"Admin"})
def create_tag():
    """
    Create a tag
    """
    tag = request.json
    try:
        created_tag = tags_service.create_tag(tag)
        return jsonify(created_tag), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
