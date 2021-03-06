"""empty message

Revision ID: c9bb742449c9
Revises: 
Create Date: 2020-11-06 19:02:03.180510

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c9bb742449c9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('abstract',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('pub_year', sa.Integer(), nullable=True),
    sa.Column('pii', sa.String(), nullable=True),
    sa.Column('doi', sa.String(), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('text', sa.String(), nullable=True),
    sa.Column('journal_name', sa.String(), nullable=True),
    sa.Column('has_corros', sa.Integer(), nullable=True),
    sa.Column('relevance_classification', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_abstract_doi'), 'abstract', ['doi'], unique=False)
    op.create_index(op.f('ix_abstract_pii'), 'abstract', ['pii'], unique=False)
    op.create_index(op.f('ix_abstract_title'), 'abstract', ['title'], unique=False)
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('password_hash', sa.String(length=128), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    op.create_table('edit',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('abstract_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.Column('edit_type', sa.String(), nullable=True),
    sa.Column('old_val', sa.String(), nullable=True),
    sa.Column('new_val', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['abstract_id'], ['abstract.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_edit_timestamp'), 'edit', ['timestamp'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_edit_timestamp'), table_name='edit')
    op.drop_table('edit')
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_index(op.f('ix_abstract_title'), table_name='abstract')
    op.drop_index(op.f('ix_abstract_pii'), table_name='abstract')
    op.drop_index(op.f('ix_abstract_doi'), table_name='abstract')
    op.drop_table('abstract')
    # ### end Alembic commands ###
