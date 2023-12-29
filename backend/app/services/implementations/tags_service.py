from ..interfaces.tags_service import ITagsService
from ...models.tags import Tag
from ...models.log_record_tags import LogRecordTag
from ...models import db


class TagsService(ITagsService):
    """
    Tags implementation with tags management methods
    """

    def __init__(self, logger):
        """
        Create an instance of TagsService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def get_tags(self):
        try:
            tags_results = Tag.query.order_by(Tag.last_modified.desc()).all()
            tags_results = list(map(lambda tag: tag.to_dict(), tags_results))
            return {"tags": tags_results}
        except Exception as postgres_error:
            raise postgres_error

    def delete_tag(self, tag_id):
        tags_to_delete = Tag.query.filter_by(tag_id=tag_id).first()
        if not tags_to_delete:
            raise Exception(
                "Log record with id {log_id} not found".format(log_id=log_id)
            )
        tags_to_delete.log_records = []
        db.session.delete(tags_to_delete)
        db.session.commit()

    def update_tag(self, tag_id, updated_tag):
        updated_name = updated_tag["name"]
        try:
            create_update_tag = Tag.query.filter_by(tag_id=tag_id).update(
                {
                    **updated_tag,
                }
            )
            if not create_update_tag:
                raise Exception("Tag with id {tag_id} not found".format(tag_id=tag_id))
            db.session.commit()
        except Exception as error:
            if type(error).__name__ == "IntegrityError":
                raise Exception(
                    "Tag name {name} already exists".format(name=updated_name)
                )
            else:
                raise error

    def create_tag(self, tag):
        try:
            new_tag = Tag(**tag)
            db.session.add(new_tag)
            db.session.commit()
            return tag
        except Exception as error:
            if type(error).__name__ == "IntegrityError":
                raise Exception(
                    "Tag name {name} already exists".format(name=tag["name"])
                )
            else:
                raise error
