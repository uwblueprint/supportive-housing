"""add last_modified to tags

Revision ID: 0dbe140cf6f5
Revises: 8b5132609f1f
Create Date: 2023-11-09 01:59:44.190531

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0dbe140cf6f5"
down_revision = "0ea2257f1dc6"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("tags", schema=None) as batch_op:
        batch_op.add_column(sa.Column("last_modified", sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), onupdate=sa.text('CURRENT_TIMESTAMP'), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("tags", schema=None) as batch_op:
        batch_op.drop_column("last_modified")

    # ### end Alembic commands ###
