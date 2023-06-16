"""add status and email to users table

Revision ID: a2a0a16b6d51
Revises: 0cc810be5494
Create Date: 2023-05-28 22:21:11.795813

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'a2a0a16b6d51'
down_revision = '82f36cdf325f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    user_statuses = postgresql.ENUM('Invited', 'Active', 'Deactivated', name='user_statuses')
    user_statuses.create(op.get_bind())

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_status', sa.Enum('Invited', 'Active', 'Deactivated', name='user_statuses'), nullable=False))
        batch_op.add_column(sa.Column('email', sa.String(), nullable=False))
        batch_op.alter_column('auth_id',
               existing_type=sa.VARCHAR(),
               nullable=True)
        
    op.create_check_constraint(
    'check_auth_id_nullable',
    "users",
    "(user_status = 'Invited' AND auth_id IS NULL) OR (user_status != 'Invited' AND auth_id IS NOT NULL)",
    )

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('check_auth_id_nullable', 'users', type_='check')
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('auth_id',
               existing_type=sa.VARCHAR(),
               nullable=False)
        batch_op.drop_column('email')
        batch_op.drop_column('user_status')
    
    user_statuses = postgresql.ENUM('INVITED', 'ACTIVE', 'DEACTIVATED', name='user_statuses')
    user_statuses.drop(op.get_bind())

    # ### end Alembic commands ###