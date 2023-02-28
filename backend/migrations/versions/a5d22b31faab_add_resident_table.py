"""add resident table

Revision ID: a5d22b31faab
Revises: 82f36cdf325f
Create Date: 2023-05-19 01:25:31.068941

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a5d22b31faab'
down_revision = '82f36cdf325f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('residents',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('initial', sa.String(), nullable=False),
    sa.Column('room_num', sa.Integer(), nullable=False),
    sa.Column('date_joined', sa.Date(), nullable=False),
    sa.Column('date_left', sa.Date(), nullable=True),
    sa.Column('building', sa.Enum('144', '402', '362', name='buildings'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('log_records', schema=None) as batch_op:
        batch_op.add_column(sa.Column('resident_id', sa.Integer(), nullable=False))
        batch_op.drop_constraint('log_records_employee_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'users', ['employee_id'], ['id'])
        batch_op.create_foreign_key(None, 'residents', ['resident_id'], ['id'])
        batch_op.drop_column('resident_first_name')
        batch_op.drop_column('resident_last_name')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('log_records', schema=None) as batch_op:
        batch_op.add_column(sa.Column('resident_first_name', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('resident_last_name', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('log_records_employee_id_fkey', 'users', ['employee_id'], ['id'])
        batch_op.drop_column('resident_id')

    op.drop_table('residents')
    # ### end Alembic commands ###