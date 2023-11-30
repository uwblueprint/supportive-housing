"""empty message

Revision ID: 117790caec65
Revises: 8b5132609f1f
Create Date: 2023-11-16 01:53:04.353305

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '117790caec65'
down_revision = '8b5132609f1f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tags', schema=None) as batch_op:
        batch_op.drop_column('status')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tags', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', postgresql.ENUM('Deleted', 'Active', name='status'), autoincrement=False, nullable=False))

    # ### end Alembic commands ###
