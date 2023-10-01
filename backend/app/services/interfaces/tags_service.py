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
