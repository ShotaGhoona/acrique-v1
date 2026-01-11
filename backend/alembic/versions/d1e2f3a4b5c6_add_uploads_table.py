"""add_uploads_table

Revision ID: d1e2f3a4b5c6
Revises: c8f3a1b2d456
Create Date: 2026-01-11

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'd1e2f3a4b5c6'
down_revision: str | None = 'c8f3a1b2d456'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'uploads',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=True),
        sa.Column('order_item_id', sa.Integer(), nullable=True),
        sa.Column('file_name', sa.String(length=255), nullable=False),
        sa.Column('s3_key', sa.String(length=500), nullable=False),
        sa.Column('file_url', sa.String(length=500), nullable=False),
        sa.Column('file_type', sa.String(length=100), nullable=True),
        sa.Column('file_size', sa.Integer(), nullable=True),
        sa.Column('upload_type', sa.String(length=50), nullable=True),
        sa.Column('text_content', sa.Text(), nullable=True),
        sa.Column(
            'status', sa.String(length=30), nullable=False, server_default='pending'
        ),
        sa.Column('admin_notes', sa.Text(), nullable=True),
        sa.Column('reviewed_by', sa.Integer(), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column(
            'created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ['user_id'],
            ['users.id'],
        ),
        sa.ForeignKeyConstraint(
            ['order_id'],
            ['orders.id'],
        ),
        sa.ForeignKeyConstraint(
            ['order_item_id'],
            ['order_items.id'],
        ),
        sa.ForeignKeyConstraint(
            ['reviewed_by'],
            ['admins.id'],
        ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_uploads_user_id'), 'uploads', ['user_id'], unique=False)
    op.create_index(op.f('ix_uploads_order_id'), 'uploads', ['order_id'], unique=False)
    op.create_index(
        op.f('ix_uploads_order_item_id'), 'uploads', ['order_item_id'], unique=False
    )
    op.create_index(op.f('ix_uploads_status'), 'uploads', ['status'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_uploads_status'), table_name='uploads')
    op.drop_index(op.f('ix_uploads_order_item_id'), table_name='uploads')
    op.drop_index(op.f('ix_uploads_order_id'), table_name='uploads')
    op.drop_index(op.f('ix_uploads_user_id'), table_name='uploads')
    op.drop_table('uploads')
