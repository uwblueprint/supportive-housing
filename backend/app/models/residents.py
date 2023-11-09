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
    building_id = db.Column(db.Integer, db.ForeignKey("buildings.id"), nullable=False)
    building = db.relationship("Buildings", back_populates="resident")
    log_records = db.relationship("LogRecords", secondary="log_record_residents", back_populates="residents")

    resident_id = db.column_property(initial + cast(room_num, String))

    __table_args__ = (
        db.CheckConstraint(
            "date_left IS NULL OR date_left > date_joined", name="check_date_left_valid"
        ),
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
                if field == "building_id":
                    formatted["building"] = {"id": attr}
                elif (field == "date_joined" or field == "date_left") and attr:
                    formatted[field] = attr.strftime("%Y-%m-%d")
                else:
                    formatted[field] = attr
            # otherwise, it's a relationship field
            # (currently not applicable, but may be useful for entity groups)
            elif include_relationships:
                # recursively format the relationship
                # don't format the relationship's relationships
                formatted[field] = [obj.to_dict() for obj in attr]
        return formatted
