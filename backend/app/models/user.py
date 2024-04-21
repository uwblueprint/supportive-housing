from sqlalchemy import func, inspect, case, null
from sqlalchemy.orm.properties import ColumnProperty

from . import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    auth_id = db.Column(db.String, nullable=True)
    role = db.Column(
        db.Enum("Admin", "Regular Staff", "Relief Staff", name="roles"), nullable=False
    )
    user_status = db.Column(
        db.Enum("Invited", "Active", "Deactivated", name="user_statuses"),
        nullable=False,
    )
    email = db.Column(db.String, nullable=False)
    last_modified = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
    log_records = db.relationship(
        "LogRecords", secondary="log_record_attn_tos", back_populates="attn_tos"
    )

    __table_args__ = (
        db.CheckConstraint(
            "(user_status = 'Invited' AND auth_id IS NULL) OR (user_status != 'Invited' AND auth_id IS NOT NULL)",
            name="check_auth_id_nullable",
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
                formatted[field] = attr
            # otherwise, it's a relationship field
            # (currently not applicable, but may be useful for entity groups)
            elif include_relationships:
                # recursively format the relationship
                # don't format the relationship's relationships
                formatted[field] = [obj.to_dict() for obj in attr]
        return formatted
