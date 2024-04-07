from flask import current_app
from ..interfaces.residents_service import IResidentsService
from ...models.residents import Residents
from ...models.log_record_residents import LogRecordResidents
from ...models.buildings import Buildings
from ...models import db
from ...utilities.exceptions.duplicate_entity_exceptions import (
    DuplicateResidentException,
)
from datetime import datetime
from sqlalchemy.sql.expression import or_, and_, case
from pytz import timezone


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

    def to_resident_json(self, resident, current_date):
        resident, building = resident[0], resident[1]

        resident_dict = resident.to_dict()
        resident_dict["building"]["name"] = building
        resident_dict["status"] = self.get_resident_status(
            current_date, resident_dict["date_joined"], resident_dict["date_left"]
        )

        return resident_dict

    def to_residents_json_list(self, residents, current_date):
        residents_json_list = []
        for result in residents:
            resident, building, status = result[0], result[1], result[2]

            resident_dict = resident.to_dict()
            resident_dict["building"]["name"] = building
            resident_dict["status"] = status

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

    def construct_filters(self, query, filters, status_column):
        residents = filters.get("residents")
        buildings = filters.get("buildings")
        statuses = filters.get("statuses")
        date_left = None
        date_joined = None

        if filters.get("date_range") is not None:
            date_joined, date_left = filters.get("date_range")
            if date_joined is not None:
                date_joined = datetime.strptime(date_joined, "%Y-%m-%d").replace(
                    hour=0, minute=0
                )
            if date_left is not None:
                date_left = datetime.strptime(date_left, "%Y-%m-%d").replace(
                    hour=0, minute=0
                )

        if buildings is not None:
            query = query.filter(Residents.building_id.in_(buildings))
        if residents is not None:
            query = query.filter(Residents.id.in_(residents))
        if statuses is not None:
            query = query.filter(status_column.in_(statuses))
        if date_joined is not None:
            query = query.filter(Residents.date_joined >= date_joined)
        if date_left is not None:
            query = query.filter(Residents.date_left <= date_left)

        return query

    def add_resident(self, resident):
        try:
            new_resident = Residents(**resident)
            db.session.add(new_resident)
            db.session.commit()
            return resident
        except Exception as e:
            if type(e).__name__ == "IntegrityError":
                raise DuplicateResidentException(
                    resident["initial"] + resident["room_num"]
                )
            else:
                raise e

    def update_resident(self, resident_id, updated_resident):
        try:
            if "date_left" in updated_resident:
                create_update_resident = Residents.query.filter_by(
                    id=resident_id
                ).update(
                    {
                        Residents.date_left: updated_resident["date_left"],
                        **updated_resident,
                    }
                )
            else:
                create_update_resident = Residents.query.filter_by(
                    id=resident_id
                ).update({Residents.date_left: None, **updated_resident})
            if not create_update_resident:
                raise Exception(
                    "Tenant with id {resident_id} not found".format(
                        resident_id=resident_id
                    )
                )
            db.session.commit()
        except Exception as e:
            if type(e).__name__ == "IntegrityError":
                raise DuplicateResidentException(
                    updated_resident["initial"] + updated_resident["room_num"]
                )
            else:
                raise e

    def delete_resident(self, resident_id):
        resident_log_records = LogRecordResidents.query.filter_by(
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

    def get_resident_by_id(self, resident_id):
        try:
            current_date = datetime.now(timezone("US/Eastern")).strftime("%Y-%m-%d")

            resident = (
                Residents.query.join(Buildings, Buildings.id == Residents.building_id)
                .with_entities(Residents, Buildings.name.label("building"))
                .filter_by(resident_id=resident_id)
                .first()
            )
            return self.to_resident_json(resident, current_date) if resident else None
        except Exception as postgres_error:
            raise postgres_error

    def get_residents(self, return_all, page_number, results_per_page, filters=None):
        try:
            current_date = datetime.now(timezone("US/Eastern")).strftime("%Y-%m-%d")

            # add a status column based on the current date
            status_column = case(
                (
                    and_(
                        Residents.date_joined <= current_date,
                        or_(
                            Residents.date_left.is_(None),
                            Residents.date_left >= current_date,
                        ),
                    ),
                    "Current",
                ),
                (Residents.date_joined > current_date, "Future"),
                (Residents.date_left < current_date, "Past"),
            ).label("status")

            residents_results = Residents.query.join(
                Buildings, Buildings.id == Residents.building_id
            ).with_entities(Residents, Buildings.name.label("building"), status_column)
            if filters:
                residents_results = self.construct_filters(
                    residents_results, filters, status_column
                )

            if not return_all:
                residents_results = (
                    residents_results.order_by(
                        status_column,
                        case((Residents.date_left.is_(None), 0), else_=1),
                        Residents.room_num,
                        Residents.initial,
                    )
                    .limit(results_per_page)
                    .offset((page_number - 1) * results_per_page)
                )
            else:
                residents_results = residents_results.order_by(
                    Residents.room_num, Residents.initial
                ).all()

            return {
                "residents": self.to_residents_json_list(
                    residents_results, current_date
                )
            }

        except Exception as postgres_error:
            raise postgres_error

    def count_residents(self, filters):
        try:
            current_date = datetime.now(timezone("US/Eastern")).strftime("%Y-%m-%d")

            # add a status column based on the current date
            status_column = case(
                (
                    and_(
                        Residents.date_joined <= current_date,
                        or_(
                            Residents.date_left.is_(None),
                            Residents.date_left >= current_date,
                        ),
                    ),
                    "Current",
                ),
                (Residents.date_joined > current_date, "Future"),
                (Residents.date_left < current_date, "Past"),
            ).label("status")

            residents_results = Residents.query.join(
                Buildings, Buildings.id == Residents.building_id
            ).with_entities(Residents, Buildings.name.label("building"), status_column)

            if filters:
                residents_results = self.construct_filters(
                    residents_results, filters, status_column
                )

            count = residents_results.count()
            return {"num_results": count}

        except Exception as postgres_error:
            raise postgres_error
