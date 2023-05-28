from . import db
from sqlalchemy import inspect
from sqlalchemy.orm.properties import ColumnProperty

class LogRecords(db.Model):
    __tablename__ = "log_records"
    log_id = db.Column(db.Integer, primary_key=True, nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    resident_id = db.Column(db.Integer,db.ForeignKey("residents.id"), nullable=False)
    datetime = db.Column(db.DateTime(timezone=True), nullable=False)
    flagged = db.Column(db.Boolean, nullable=False)
    attn_to = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    # TODO: replace open String fields with VarChar(NUM_CHARS)
    note = db.Column(db.String, nullable=True)
    tags = db.Column(db.ARRAY(db.String), nullable=True)
    building = db.Column(db.String, nullable=False)

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