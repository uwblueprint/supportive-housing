from ..interfaces.residents_service import IResidentsService
from ...models.residents import Residents
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
                       "date_joined": str(resident.date_joined),
                       "date_left": str(resident.date_left),
                       "building": resident.building,
                       "resident_id": resident.resident_id
                    }
                )
            return json.dumps(residents_list)
        except Exception as postgres_error:
            raise postgres_error
        
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
            Residents.query.filter_by(id=resident_id).update(
                {
                    Residents.date_left: updated_resident["date_left"],
                }
            )
        updated_resident = Residents.query.filter_by(id=resident_id).update(
            {
                Residents.initial: updated_resident["initial"],
                Residents.room_num: updated_resident["room_num"],
                Residents.date_joined: updated_resident["date_joined"],
                Residents.building: updated_resident["building"],
            }
        )
        if not updated_resident:
            raise Exception(
                "Resident with id {resident_id} not found".format(
                    resident_id=resident_id
                )
            )
        db.session.commit()

    def delete_resident(self, resident_id):
        deleted_resident = Residents.query.filter_by(id=resident_id).delete()
        if not deleted_resident:
            raise Exception(
                "Resident with id {resident_id} not found".format(
                    resident_id=resident_id
                )
            )
        db.session.commit()

    def get_resident(self, resident_id=None):
        try:
            if resident_id:
                residents_results = Residents.query.filter_by(resident_id = resident_id)
            else:
                residents_results = Residents.query.all()
            
            return self.to_json_list(residents_results)
        except Exception as postgres_error:
            raise postgres_error