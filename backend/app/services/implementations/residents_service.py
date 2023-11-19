from ..interfaces.residents_service import IResidentsService
from ...models.residents import Residents
from ...models.log_records import LogRecords
from ...models.buildings import Buildings
from ...models import db
from datetime import datetime
from sqlalchemy import select, cast, Date
import json


class ResidentsService(IResidentsService):
    """
    Residents implementation with residents management methods
    """

    def __init__(self, logger):
        """
        Create an instance of ResidentsService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def to_residents_json_list(self, resident_results):
        residents_json_list = []
        for result in resident_results:
            resident, building = result[0], result[1]

            resident_dict = resident.to_dict()
            resident_dict["building"]["name"] = building
            residents_json_list.append(resident_dict)
        return residents_json_list

    def convert_to_date_obj(self, date):
        return datetime.strptime(date, "%Y-%m-%d")

    def is_date_left_invalid_resident(self, resident):
        """
        Validates if date_left is greater than date_joined given a payload for a resident
        """
        if "date_joined" in resident:
            resident["date_joined"] = self.convert_to_date_obj(resident["date_joined"])

        if "date_left" in resident:
            resident["date_left"] = self.convert_to_date_obj(resident["date_left"])

        if "date_joined" in resident and "date_left" in resident:
            if resident["date_left"] < resident["date_joined"]:
                return True

        return False

    def add_resident(self, resident):
        try:
            new_resident = Residents(**resident)
            db.session.add(new_resident)
            db.session.commit()
            return resident
        except Exception as postgres_error:
            raise postgres_error

    def update_resident(self, resident_id, updated_resident):
        if "date_left" in updated_resident:
            create_update_resident = Residents.query.filter_by(id=resident_id).update(
                {
                    Residents.date_left: updated_resident["date_left"],
                    **updated_resident,
                }
            )
        else:
            create_update_resident = Residents.query.filter_by(id=resident_id).update(
                {Residents.date_left: None, **updated_resident}
            )
        if not create_update_resident:
            raise Exception(
                "Resident with id {resident_id} not found".format(
                    resident_id=resident_id
                )
            )
        db.session.commit()

    def delete_resident(self, resident_id):
        resident_log_records = LogRecords.query.filter_by(
            resident_id=resident_id
        ).count()
        if resident_log_records == 0:
            deleted_resident = Residents.query.filter_by(id=resident_id).delete()
            if not deleted_resident:
                raise Exception(
                    "Resident with id {resident_id} not found".format(
                        resident_id=resident_id
                    )
                )
        else:
            raise Exception(
                "Resident with id {resident_id} has existing log records".format(
                    resident_id=resident_id
                )
            )
        db.session.commit()

    def get_residents(
        self, return_all, page_number, results_per_page, resident_id=None, filters=None
    ):
        try:
            if resident_id:
                residents_results = (
                    Residents.query.join(
                        Buildings, Buildings.id == Residents.building_id
                    )
                    .with_entities(Residents, Buildings.name.label("building"))
                    .filter_by(resident_id=resident_id)
                )
            elif return_all:
                residents_results = (
                    Residents.query.join(
                        Buildings, Buildings.id == Residents.building_id
                    )
                    .with_entities(Residents, Buildings.name.label("building"))
                    .all()
                )
            elif filters:
                resident_id = filters.get("resident_id")
                building_id = filters.get("building_id")
                date_left = None
                date_joined = None

                if filters.get("date_range") is not None:
                    date_joined, date_left = filters.get("date_range")
                    if date_joined is not None:
                        date_joined = datetime.strptime(
                            date_joined, "%Y-%m-%d"
                        ).replace(hour=0, minute=0)
                    if date_left is not None:
                        date_left = datetime.strptime(date_left, "%Y-%m-%d").replace(
                            hour=0, minute=0
                        )

                residents_results = Residents.query.join(
                    Buildings, Buildings.id == Residents.building_id
                ).with_entities(Residents, Buildings.name.label("building"))

                if building_id is not None:
                    residents_results = residents_results.filter(
                        Residents.building_id.in_(building_id)
                    )
                if resident_id is not None:
                    residents_results = residents_results.filter(
                        Residents.resident_id.in_(resident_id)
                    )
                if date_joined is not None and date_left is not None:
                    residents_results = residents_results.filter(
                        Residents.date_joined >= date_joined
                    )
                    residents_results = residents_results.filter(
                        Residents.date_left <= date_left
                    )
                elif date_joined is not None:
                    residents_results = residents_results.filter(
                        Residents.date_joined >= date_joined
                    )
                elif date_left is not None:
                    residents_results = residents_results.filter(
                        Residents.date_left <= date_left
                    )
            else:
                residents_results = (
                    Residents.query.join(
                        Buildings, Buildings.id == Residents.building_id
                    )
                    .limit(results_per_page)
                    .offset((page_number - 1) * results_per_page)
                    .with_entities(Residents, Buildings.name.label("building"))
                    .all()
                )

            return {"residents": self.to_residents_json_list(residents_results)}
        except Exception as postgres_error:
            raise postgres_error

    def count_residents(self):
        try:
            count = Residents.query.count()
            return {"num_results": count}

        except Exception as postgres_error:
            raise postgres_error
