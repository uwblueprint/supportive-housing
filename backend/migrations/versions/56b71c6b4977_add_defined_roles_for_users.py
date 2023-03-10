"""add defined roles for users

Revision ID: 56b71c6b4977
Revises: 797bfedc3a06
Create Date: 2023-02-05 20:15:49.674896

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "56b71c6b4977"
down_revision = "797bfedc3a06"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "users",
        "role",
        existing_type=postgresql.ENUM(
            "Admin", "Regular Staff", "Relief Staff", name="roles"
        ),
        nullable=False,
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "users",
        "role",
        existing_type=postgresql.ENUM("User", "Admin", name="roles"),
        nullable=True,
    )
    # ### end Alembic commands ###
