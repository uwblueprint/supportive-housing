"""add invited_users db

Revision ID: 0cc810be5494
Revises: 58313513d17f
Create Date: 2023-02-21 03:05:30.019336

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0cc810be5494'
down_revision = '58313513d17f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('invited_users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('role', postgresql.ENUM('Admin', 'Regular Staff', 'Relief Staff', name='roles', create_type=False), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('invited_users')
    # ### end Alembic commands ###
