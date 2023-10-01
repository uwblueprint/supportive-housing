from ..interfaces.tags_service import ITagsService
from ...models.tag import Tag
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
            tags_results = Tag.query.all()
            tags_results = list(map(lambda tag: tag.to_dict(), tags_results))
            return {"tags": tags_results}
        except Exception as postgres_error:
            raise postgres_error
        
    def delete_tag(self, tag_id):        
        deleted_tag = Tag.query.filter_by(tag_id=tag_id).update({"status": "Deleted"})
        if not deleted_tag:
            raise Exception(
                "Tag with id {tag_id} not found".format(tag_id=tag_id)
            )
        db.session.commit()