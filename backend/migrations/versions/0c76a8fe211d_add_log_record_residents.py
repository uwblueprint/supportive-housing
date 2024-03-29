"""add log_record_residents

Revision ID: 0c76a8fe211d
Revises: 24fad25f60e3
Create Date: 2023-10-19 00:02:43.259307

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0c76a8fe211d"
down_revision = "0ea2257f1dc6"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "log_record_residents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("log_record_id", sa.Integer(), nullable=False),
        sa.Column("resident_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["log_record_id"],
            ["log_records.log_id"],
        ),
        sa.ForeignKeyConstraint(
            ["resident_id"],
            ["residents.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("log_records", schema=None) as batch_op:
        batch_op.drop_constraint("log_records_resident_id_fkey", type_="foreignkey")
        batch_op.drop_column("resident_id")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("log_records", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("resident_id", sa.INTEGER(), autoincrement=False, nullable=False)
        )
        batch_op.create_foreign_key(
            "log_records_resident_id_fkey", "residents", ["resident_id"], ["id"]
        )

    op.drop_table("log_record_residents")
    # ### end Alembic commands ###
