"""tag name unique constraint

Revision ID: 0ea2257f1dc6
Revises: 8b5132609f1f
Create Date: 2023-11-08 20:53:54.334014

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0ea2257f1dc6"
down_revision = "24fad25f60e3"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("tags", schema=None) as batch_op:
        batch_op.create_unique_constraint(None, ["name"])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("tags", schema=None) as batch_op:
        batch_op.drop_constraint("tags_name_key", type_="unique")

    # ### end Alembic commands ###
