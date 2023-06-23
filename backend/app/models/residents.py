from . import db
from sqlalchemy import inspect, cast, String
from sqlalchemy.orm.properties import ColumnProperty


class Residents(db.Model):
    __tablename__ = "residents"
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    initial = db.Column(db.String, nullable=False)
    room_num = db.Column(db.Integer, nullable=False)
    date_joined = db.Column(db.Date, nullable=False)
    date_left = db.Column(db.Date, nullable=True)
    building = db.Column(db.Enum("144", "402", "362", name="buildings"), nullable=False)

    resident_id = db.column_property(initial + cast(room_num, String))

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
