"""add last modified to residents

Revision ID: a1f05c8f324c
Revises: 117790caec65
Create Date: 2024-01-13 20:22:32.969646

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1f05c8f324c'
down_revision = '117790caec65'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('log_record_tag', schema=None) as batch_op:
        batch_op.drop_constraint('log_record_tag_tag_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'tags', ['tag_id'], ['tag_id'], ondelete='CASCADE')

    with op.batch_alter_table('residents', schema=None) as batch_op:
        batch_op.add_column(sa.Column('last_modified', sa.DateTime(), server_default=sa.text('now()'), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('residents', schema=None) as batch_op:
        batch_op.drop_column('last_modified')

    with op.batch_alter_table('log_record_tag', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('log_record_tag_tag_id_fkey', 'tags', ['tag_id'], ['tag_id'])

    # ### end Alembic commands ###
