"""シード実行スクリプト"""

import sys
from pathlib import Path

# プロジェクトルートをパスに追加
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))

from sqlalchemy.orm import Session

from app.infrastructure.db.models.address_model import AddressModel
from app.infrastructure.db.models.cart_item_model import CartItemModel
from app.infrastructure.db.models.order_model import OrderItemModel, OrderModel
from app.infrastructure.db.models.product_model import (
    ProductFaqModel,
    ProductFeatureModel,
    ProductImageModel,
    ProductModel,
    ProductOptionModel,
    ProductOptionValueModel,
    ProductRelationModel,
    ProductSpecModel,
)
from app.infrastructure.db.models.user_model import UserModel
from app.infrastructure.db.seeds.address_seed import ADDRESSES
from app.infrastructure.db.seeds.cart_seed import CART_ITEMS
from app.infrastructure.db.seeds.order_seed import ORDERS
from app.infrastructure.db.seeds.product_seed import (
    PRODUCT_FAQS,
    PRODUCT_FEATURES,
    PRODUCT_IMAGES,
    PRODUCT_OPTION_VALUES,
    PRODUCT_OPTIONS,
    PRODUCT_RELATIONS,
    PRODUCT_SPECS,
    PRODUCTS,
)
from app.infrastructure.db.seeds.user_seed import USERS
from app.infrastructure.db.session import SessionLocal


def seed_products(session: Session) -> None:
    """商品データをシード"""
    print('商品データをシード中...')

    # 既存データを削除（外部キー制約の順序に注意）
    session.query(ProductRelationModel).delete()
    session.query(ProductFaqModel).delete()
    session.query(ProductFeatureModel).delete()
    session.query(ProductSpecModel).delete()
    session.query(ProductOptionValueModel).delete()
    session.query(ProductOptionModel).delete()
    session.query(ProductImageModel).delete()
    session.query(ProductModel).delete()
    session.commit()
    print('  既存データを削除しました')

    # 商品を登録
    for product_data in PRODUCTS:
        product = ProductModel(**product_data)
        session.add(product)
    session.commit()
    print(f'  商品を {len(PRODUCTS)} 件登録しました')

    # 商品画像を登録
    for image_data in PRODUCT_IMAGES:
        image = ProductImageModel(**image_data)
        session.add(image)
    session.commit()
    print(f'  商品画像を {len(PRODUCT_IMAGES)} 件登録しました')

    # 商品オプションを登録（option_idを保持するためのマッピング）
    option_id_map: dict[str, int] = {}
    for option_data in PRODUCT_OPTIONS:
        option = ProductOptionModel(**option_data)
        session.add(option)
        session.flush()  # IDを取得するためにflush
        # マッピングキーを作成
        key = f'{option_data["product_id"]}_{option_data["name"]}'
        option_id_map[key] = option.id
    session.commit()
    print(f'  商品オプションを {len(PRODUCT_OPTIONS)} 件登録しました')

    # 商品オプション値を登録
    for value_data in PRODUCT_OPTION_VALUES:
        option_key = value_data['option_key']
        if option_key not in option_id_map:
            print(f'  警告: オプションキー {option_key} が見つかりません')
            continue

        value = ProductOptionValueModel(
            option_id=option_id_map[option_key],
            label=value_data['label'],
            price_diff=value_data['price_diff'],
            description=value_data['description'],
            sort_order=value_data['sort_order'],
        )
        session.add(value)
    session.commit()
    print(f'  商品オプション値を {len(PRODUCT_OPTION_VALUES)} 件登録しました')

    # 商品スペックを登録
    for spec_data in PRODUCT_SPECS:
        spec = ProductSpecModel(**spec_data)
        session.add(spec)
    session.commit()
    print(f'  商品スペックを {len(PRODUCT_SPECS)} 件登録しました')

    # 商品特長を登録
    for feature_data in PRODUCT_FEATURES:
        feature = ProductFeatureModel(**feature_data)
        session.add(feature)
    session.commit()
    print(f'  商品特長を {len(PRODUCT_FEATURES)} 件登録しました')

    # 商品FAQを登録
    for faq_data in PRODUCT_FAQS:
        faq = ProductFaqModel(**faq_data)
        session.add(faq)
    session.commit()
    print(f'  商品FAQを {len(PRODUCT_FAQS)} 件登録しました')

    # 関連商品を登録
    for relation_data in PRODUCT_RELATIONS:
        relation = ProductRelationModel(**relation_data)
        session.add(relation)
    session.commit()
    print(f'  関連商品を {len(PRODUCT_RELATIONS)} 件登録しました')


def seed_users(session: Session) -> None:
    """ユーザーデータをシード"""
    print('ユーザーデータをシード中...')

    # 既存のシードユーザーを削除（メールアドレスで判定）
    seed_emails = [user['email'] for user in USERS]

    # 先に関連するカート、注文、配送先を削除（外部キー制約対応）
    existing_users = (
        session.query(UserModel).filter(UserModel.email.in_(seed_emails)).all()
    )
    existing_user_ids = [u.id for u in existing_users]
    if existing_user_ids:
        # 注文明細を削除
        session.query(OrderItemModel).filter(
            OrderItemModel.order_id.in_(
                session.query(OrderModel.id).filter(
                    OrderModel.user_id.in_(existing_user_ids)
                )
            )
        ).delete(synchronize_session=False)
        # 注文を削除
        session.query(OrderModel).filter(
            OrderModel.user_id.in_(existing_user_ids)
        ).delete(synchronize_session=False)
        # カートを削除
        session.query(CartItemModel).filter(
            CartItemModel.user_id.in_(existing_user_ids)
        ).delete(synchronize_session=False)
        # 配送先を削除
        session.query(AddressModel).filter(
            AddressModel.user_id.in_(existing_user_ids)
        ).delete(synchronize_session=False)
        session.commit()

    session.query(UserModel).filter(UserModel.email.in_(seed_emails)).delete(
        synchronize_session=False
    )
    session.commit()
    print('  既存シードユーザーを削除しました')

    # ユーザーを登録
    for user_data in USERS:
        user = UserModel(**user_data)
        session.add(user)
    session.commit()
    print(f'  ユーザーを {len(USERS)} 件登録しました')


def seed_addresses(session: Session) -> None:
    """配送先データをシード"""
    print('配送先データをシード中...')

    # ユーザーのメールアドレスからIDを取得するマップを作成
    seed_emails = [user['email'] for user in USERS]
    users = session.query(UserModel).filter(UserModel.email.in_(seed_emails)).all()
    email_to_user_id = {user.email: user.id for user in users}

    # シードユーザーの既存配送先を削除
    user_ids = list(email_to_user_id.values())
    session.query(AddressModel).filter(AddressModel.user_id.in_(user_ids)).delete(
        synchronize_session=False
    )
    session.commit()
    print('  既存配送先を削除しました')

    # 配送先を登録
    count = 0
    for address_data in ADDRESSES:
        user_email = address_data['user_email']
        if user_email not in email_to_user_id:
            print(f'  警告: ユーザー {user_email} が見つかりません')
            continue

        address = AddressModel(
            user_id=email_to_user_id[user_email],
            label=address_data['label'],
            name=address_data['name'],
            postal_code=address_data['postal_code'],
            prefecture=address_data['prefecture'],
            city=address_data['city'],
            address1=address_data['address1'],
            address2=address_data['address2'],
            phone=address_data['phone'],
            is_default=address_data['is_default'],
        )
        session.add(address)
        count += 1
    session.commit()
    print(f'  配送先を {count} 件登録しました')


def seed_cart(session: Session) -> None:
    """カートデータをシード"""
    print('カートデータをシード中...')

    # ユーザーのメールアドレスからIDを取得するマップを作成
    seed_emails = [user['email'] for user in USERS]
    users = session.query(UserModel).filter(UserModel.email.in_(seed_emails)).all()
    email_to_user_id = {user.email: user.id for user in users}

    # シードユーザーの既存カートアイテムを削除
    user_ids = list(email_to_user_id.values())
    session.query(CartItemModel).filter(CartItemModel.user_id.in_(user_ids)).delete(
        synchronize_session=False
    )
    session.commit()
    print('  既存カートアイテムを削除しました')

    # カートアイテムを登録
    count = 0
    for cart_item_data in CART_ITEMS:
        user_email = cart_item_data['user_email']
        if user_email not in email_to_user_id:
            print(f'  警告: ユーザー {user_email} が見つかりません')
            continue

        cart_item = CartItemModel(
            user_id=email_to_user_id[user_email],
            product_id=cart_item_data['product_id'],
            quantity=cart_item_data['quantity'],
            options=cart_item_data.get('options'),
        )
        session.add(cart_item)
        count += 1
    session.commit()
    print(f'  カートアイテムを {count} 件登録しました')


def seed_orders(session: Session) -> None:
    """注文データをシード"""
    print('注文データをシード中...')

    # ユーザーのメールアドレスからIDを取得するマップを作成
    seed_emails = [user['email'] for user in USERS]
    users = session.query(UserModel).filter(UserModel.email.in_(seed_emails)).all()
    email_to_user_id = {user.email: user.id for user in users}

    # ユーザーごとの配送先を取得
    user_ids = list(email_to_user_id.values())
    addresses = (
        session.query(AddressModel).filter(AddressModel.user_id.in_(user_ids)).all()
    )
    user_addresses: dict[int, list[AddressModel]] = {}
    for addr in addresses:
        if addr.user_id not in user_addresses:
            user_addresses[addr.user_id] = []
        user_addresses[addr.user_id].append(addr)

    # シードユーザーの既存注文を削除（注文番号で判定）
    seed_order_numbers = [order['order_number'] for order in ORDERS]
    session.query(OrderItemModel).filter(
        OrderItemModel.order_id.in_(
            session.query(OrderModel.id).filter(
                OrderModel.order_number.in_(seed_order_numbers)
            )
        )
    ).delete(synchronize_session=False)
    session.query(OrderModel).filter(
        OrderModel.order_number.in_(seed_order_numbers)
    ).delete(synchronize_session=False)
    session.commit()
    print('  既存シード注文を削除しました')

    # 注文を登録
    order_count = 0
    item_count = 0
    for order_data in ORDERS:
        user_email = order_data['user_email']
        if user_email not in email_to_user_id:
            print(f'  警告: ユーザー {user_email} が見つかりません')
            continue

        user_id = email_to_user_id[user_email]

        # 配送先IDを取得
        shipping_address_id = None
        if user_id in user_addresses and user_addresses[user_id]:
            addr_index = order_data.get('shipping_address_index', 0)
            if addr_index < len(user_addresses[user_id]):
                shipping_address_id = user_addresses[user_id][addr_index].id

        order = OrderModel(
            user_id=user_id,
            order_number=order_data['order_number'],
            status=order_data['status'],
            shipping_address_id=shipping_address_id,
            subtotal=order_data['subtotal'],
            shipping_fee=order_data['shipping_fee'],
            tax=order_data['tax'],
            total=order_data['total'],
            payment_method=order_data.get('payment_method'),
            paid_at=order_data.get('paid_at'),
            shipped_at=order_data.get('shipped_at'),
            tracking_number=order_data.get('tracking_number'),
            delivered_at=order_data.get('delivered_at'),
            cancelled_at=order_data.get('cancelled_at'),
            cancel_reason=order_data.get('cancel_reason'),
            notes=order_data.get('notes'),
        )
        session.add(order)
        session.flush()  # IDを取得するためにflush

        # 注文明細を登録
        for item_data in order_data.get('items', []):
            item = OrderItemModel(
                order_id=order.id,
                product_id=item_data['product_id'],
                product_name=item_data['product_name'],
                product_name_ja=item_data.get('product_name_ja'),
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                options=item_data.get('options'),
                subtotal=item_data['subtotal'],
            )
            session.add(item)
            item_count += 1

        order_count += 1

    session.commit()
    print(f'  注文を {order_count} 件登録しました')
    print(f'  注文明細を {item_count} 件登録しました')


def run_all_seeds() -> None:
    """全シードを実行"""
    print('=' * 50)
    print('シード開始')
    print('=' * 50)

    session = SessionLocal()
    try:
        seed_users(session)
        seed_addresses(session)
        seed_products(session)
        seed_cart(session)
        seed_orders(session)
        print('=' * 50)
        print('シード完了')
        print('=' * 50)
    except Exception as e:
        session.rollback()
        print(f'エラー: {e}')
        raise
    finally:
        session.close()


if __name__ == '__main__':
    run_all_seeds()
