from ..interfaces.residents_service import IResidentsService
from ...models.residents import Residents
from ...models.log_records import LogRecords
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
                {
                    Residents.date_left: None, 
                    **updated_resident
                }
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
        self, return_all, page_number, results_per_page, resident_id=None
    ):
        try:
            if resident_id:
                residents_results = Residents.query.filter_by(resident_id=resident_id)
            elif return_all:
                residents_results = Residents.query.all()
            else:
                residents_results = (
                    Residents.query.limit(results_per_page)
                    .offset((page_number - 1) * results_per_page)
                    .all()
                )

            residents_results = list(
                map(lambda resident: resident.to_dict(), residents_results)
            )
            return {"residents": residents_results}
        except Exception as postgres_error:
            raise postgres_error

    def count_residents(self):
        try:
            count = Residents.query.count()
            return {"num_results": count}

        except Exception as postgres_error:
            raise postgres_error
