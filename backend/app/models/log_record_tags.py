from sqlalchemy import inspect
from sqlalchemy.orm.properties import ColumnProperty

from . import db


class LogRecordTag(db.Model):
    __tablename__ = "log_record_tag"

    log_record_tag_id = db.Column(db.Integer, primary_key=True, nullable=False)
    log_record_id = db.Column(
        db.Integer, db.ForeignKey("log_records.log_id"), nullable=False
    )
    tag_id = db.Column(
        db.Integer, db.ForeignKey("tags.tag_id", ondelete="CASCADE"), nullable=False
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
