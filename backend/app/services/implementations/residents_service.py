from ..interfaces.residents_service import IResidentsService
from ...models.resident import Resident
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

    def to_json_list(self, residents_results):
        try:
            residents_list = []
            for resident in residents_results:
                residents_list.append(
                    {
                       "id": resident.id,
                       "initial": resident.initial,
                       "room_num": resident.room_num,
                       "date_joined": resident.date_joined,
                       "date_left": resident.date_left,
                       "status": resident.status,
                       "building": resident.building
                    }
                )
            return json.dumps(residents_list)
        except Exception as postgres_error:
            raise postgres_error
        
    def add_resident(self, resident):
        new_resident = resident
        try:
            new_resident = Resident(**new_resident)
            db.session.add(new_resident)
            db.session.commit()
            return resident
        except Exception as postgres_error:
            raise postgres_error
        
    def update_resident(self, resident_id, updated_resident):
        updated_resident = Resident.query.filter_by(id=resident_id).update(
            {
                Resident.initial: updated_resident["initial"],
                Resident.room_num: updated_resident["room_num"],
                Resident.date_joined: updated_resident["date_joined"],
                Resident.status: updated_resident["status"],
                Resident.building: updated_resident["building"],

            }
        )
        if "date_left" in updated_resident:
            Resident.query.filter_by(id=resident_id).update(
                {
                    Resident.date_left: updated_resident["date_left"],
                }
            )
        if not updated_resident:
            raise Exception(
                "Log record with id {resident_id} not found".format(
                    resident_id=resident_id
                )
            )
        db.session.commit()

    def delete_resident(self, resident_id):
        deleted_resident = Resident.query.filter_by(id=resident_id).delete()
        if not deleted_resident:
            raise Exception(
                "Resident with id {resident_id} not found".format(
                    resident_id=resident_id
                )
            )
        db.session.commit()

    def get_resident(self):
        try:
            residents_results = Resident.query.all()

            return self.to_json_list(residents_results)
        except Exception as postgres_error:
            raise postgres_error

   