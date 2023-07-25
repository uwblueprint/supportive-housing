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

    def add_resident(self, resident):
        new_resident = resident
        try:
            new_resident = Residents(**new_resident)
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
        resident_log_records = LogRecords.query.filter_by(resident_id=resident_id).count()
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

    def get_residents(self, return_all, page_number, results_per_page, resident_id=None):
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

            residents_results = list(map(lambda resident: resident.to_dict(), residents_results))
            return {"residents": residents_results}
        except Exception as postgres_error:
            raise postgres_error
    
    def count_residents(self):
        try:
            count = Residents.query.count()
            return {"num_results": count}

        except Exception as postgres_error:
            raise postgres_error
