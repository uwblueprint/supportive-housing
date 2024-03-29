"""create junction table between log records and tags

Revision ID: 65a56c245ad7
Revises: 82f36cdf325f
Create Date: 2023-05-20 04:29:49.322186

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "65a56c245ad7"
down_revision = "82f36cdf325f"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "log_record_tag",
        sa.Column("log_record_tag_id", sa.Integer(), nullable=False),
        sa.Column("log_record_id", sa.Integer(), nullable=False),
        sa.Column("tag_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["log_record_id"],
            ["log_records.log_id"],
        ),
        sa.ForeignKeyConstraint(
            ["tag_id"],
            ["tags.tag_id"],
        ),
        sa.PrimaryKeyConstraint("log_record_tag_id"),
    )
    with op.batch_alter_table("log_records", schema=None) as batch_op:
        batch_op.drop_column("tags")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("log_records", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                "tags",
                postgresql.ARRAY(sa.VARCHAR()),
                autoincrement=False,
                nullable=True,
            )
        )

    op.drop_table("log_record_tag")
    # ### end Alembic commands ###
