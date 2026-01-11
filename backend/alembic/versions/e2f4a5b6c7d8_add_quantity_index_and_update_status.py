"""add quantity_index and update order status

Revision ID: e2f4a5b6c7d8
Revises: d1e2f3a4b5c6
Create Date: 2026-01-11 00:00:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'e2f4a5b6c7d8'
down_revision: str | None = 'd1e2f3a4b5c6'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 1. uploads テーブルに quantity_index カラムを追加
    op.add_column(
        'uploads',
        sa.Column('quantity_index', sa.Integer(), nullable=False, server_default='1'),
    )

    # 2. インデックス追加
    op.create_index(
        'ix_uploads_order_item_quantity',
        'uploads',
        ['order_item_id', 'quantity_index'],
    )

    # 3. orders テーブルのステータス値を移行
    # data_reviewing → reviewing
    op.execute("UPDATE orders SET status = 'reviewing' WHERE status = 'data_reviewing'")
    # awaiting_payment, paid, awaiting_data → pending
    op.execute(
        "UPDATE orders SET status = 'pending' WHERE status IN ('awaiting_payment', 'paid', 'awaiting_data')"
    )


def downgrade() -> None:
    # インデックス削除
    op.drop_index('ix_uploads_order_item_quantity', table_name='uploads')

    # quantity_index カラム削除
    op.drop_column('uploads', 'quantity_index')

    # ステータス値の復元（必要に応じて）
    op.execute("UPDATE orders SET status = 'data_reviewing' WHERE status = 'reviewing'")
