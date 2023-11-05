from abc import ABC, abstractmethod


class IBuildingsService(ABC):
    """
    BuildingsService interface with buildings methods
    """

    @abstractmethod
    def get_buildings(
        self
    ):
        """
        Gets buildings in json format.
        """
        pass
