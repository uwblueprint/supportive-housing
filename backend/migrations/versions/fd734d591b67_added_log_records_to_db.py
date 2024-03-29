"""added log records to db

Revision ID: fd734d591b67
Revises: 58313513d17f
Create Date: 2023-03-29 02:04:23.994093

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "fd734d591b67"
down_revision = "c24644595836"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "log_records",
        sa.Column("log_id", sa.Integer(), nullable=False),
        sa.Column("employee_id", sa.Integer(), nullable=False),
        sa.Column("resident_first_name", sa.String(), nullable=False),
        sa.Column("resident_last_name", sa.String(), nullable=False),
        sa.Column("datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column("flagged", sa.Boolean(), nullable=False),
        sa.Column("attn_to", sa.Integer(), nullable=True),
        sa.Column("note", sa.String(), nullable=False),
        sa.Column("tags", sa.ARRAY(sa.String()), nullable=True),
        sa.Column("building_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["building_id"],
            ["buildings.id"],
        ),
        sa.ForeignKeyConstraint(
            ["attn_to"],
            ["users.id"],
        ),
        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("log_id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("log_records")
    # ### end Alembic commands ###
