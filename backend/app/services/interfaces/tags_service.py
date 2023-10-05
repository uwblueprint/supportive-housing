from abc import ABC, abstractmethod


class ITagsService(ABC):
    """
    TagsService interface with tags methods
    """

    @abstractmethod
    def get_tags(self):
        """
        Gets tags in json format.
        """
        pass
    
    @abstractmethod
    def update_tag(self, tag_id, updated_tag):
        """
        Updates tag with specified tag_id with the updated_tag

        Args:
            tag_id (int): tag ID of the tag that is to be updated
            updated_tag (json): json object that contains the info of the tag that is to be updated
        """
        pass