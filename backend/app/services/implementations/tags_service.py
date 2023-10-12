from ..interfaces.tags_service import ITagsService
from ...models.tags import Tag


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
