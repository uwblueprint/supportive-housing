from flask import jsonify
from ..interfaces.buildings_service import IBuildingsService
from ...models.buildings import Buildings
from ...models import db


class BuildingsService(IBuildingsService):
    """
    Buildings implementation
    """

    def __init__(self, logger):
        """
        Create an instance of BuildingsService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def get_buildings(self):
        try:
            buildings_results = Buildings.query.all()

            return {
                "buildings": list(
                    map(lambda building: building.to_dict(), buildings_results)
                )
            }
        except Exception as postgres_error:
            raise postgres_error
