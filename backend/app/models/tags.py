from sqlalchemy import inspect
from sqlalchemy.orm.properties import ColumnProperty

from . import db


class Tag(db.Model):
    __tablename__ = "tags"

    tag_id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String, unique=True, nullable=False)
    last_modified = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now(),
        nullable=False,
    )
    log_records = db.relationship(
        "LogRecords", secondary="log_record_tag", back_populates="tags"
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
