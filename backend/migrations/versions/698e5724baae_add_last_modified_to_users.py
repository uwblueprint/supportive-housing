"""add last_modified to users

Revision ID: 698e5724baae
Revises: 8b5132609f1f
Create Date: 2023-11-08 20:26:08.758322

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "698e5724baae"
down_revision = "0c76a8fe211d"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                "last_modified",
                sa.DateTime(),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                onupdate=sa.text("CURRENT_TIMESTAMP"),
                nullable=False,
            )
        )

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_column("last_modified")

    # ### end Alembic commands ###
