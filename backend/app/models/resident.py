from . import db
from sqlalchemy import inspect
from sqlalchemy.orm.properties import ColumnProperty

class Resident(db.Model):
    __tablename__ = "residents"
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    initial = db.Column(db.String, nullable=False)
    room_num = db.Column(db.Integer, nullable=False)
    date_joined = db.Column(db.Date, nullable=False)
    status = db.Column(
        db.Enum("Current", "Past", name="statuses"), nullable=False
        )
    building = db.Column(
        db.Enum("Seniors", "Adults", "Supports", name="buildings"), nullable=False
        )
    address = db.Column(
        db.Enum("144 Erb St. East", "402 Erb St. West", "362 Erb St. West", name="buildings"), nullable=True
        )

    def to_dict(self, include_relationships=False):
        # define the entities table
        cls = type(self)

        mapper = inspect(cls)
        formatted = {}
        for column in mapper.attrs:
            field = column.key
            attr = getattr(self, field)
            # if it's a regular column, extract the value
            if isinstance(column, ColumnProperty):
                formatted[field] = attr
            # otherwise, it's a relationship field
            # (currently not applicable, but may be useful for entity groups)
            elif include_relationships:
                # recursively format the relationship
                # don't format the relationship's relationships
                formatted[field] = [obj.to_dict() for obj in attr]
        return formatted  

