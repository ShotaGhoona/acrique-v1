"""シード実行スクリプト"""

import sys
import uuid
from pathlib import Path

# プロジェクトルートをパスに追加
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))

import boto3
from botocore.config import Config as BotoConfig
from sqlalchemy.orm import Session

from app.config import get_settings
from app.infrastructure.db.models.address_model import AddressModel
from app.infrastructure.db.models.cart_item_model import CartItemModel
from app.infrastructure.db.models.order_model import OrderItemModel, OrderModel
from app.infrastructure.db.models.product_master_model import ProductMasterModel
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
from app.infrastructure.db.models.upload_model import UploadModel
from app.infrastructure.db.models.user_model import UserModel
from app.infrastructure.db.seeds.address_seed import ADDRESSES
from app.infrastructure.db.seeds.cart_seed import CART_ITEMS
from app.infrastructure.db.seeds.order_seed import ORDERS
from app.infrastructure.db.seeds.product_seed import (
    PRODUCT_FAQS,
    PRODUCT_FEATURES,
    PRODUCT_IMAGES,
    PRODUCT_MASTERS,
    PRODUCT_OPTION_VALUES,
    PRODUCT_OPTIONS,
    PRODUCT_RELATIONS,
    PRODUCT_SPECS,
    PRODUCTS,
)
from app.infrastructure.db.seeds.user_seed import USERS
from app.infrastructure.db.session import SessionLocal

# シード画像のベースディレクトリ
SEED_IMAGES_DIR = Path(__file__).parent / 'images'

# MIMEタイプマッピング
EXTENSION_TO_CONTENT_TYPE = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
}


def get_s3_client():
    """S3クライアントを取得"""
    settings = get_settings()

    boto_config = BotoConfig(
        region_name=settings.aws_s3_region,
        signature_version='s3v4',
        s3={'addressing_style': 'virtual'},
    )
    endpoint_url = f'https://s3.{settings.aws_s3_region}.amazonaws.com'

    if settings.aws_access_key_id and settings.aws_secret_access_key:
        return boto3.client(
            's3',
            region_name=settings.aws_s3_region,
            endpoint_url=endpoint_url,
            config=boto_config,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )
    else:
        return boto3.client(
            's3',
            region_name=settings.aws_s3_region,
            endpoint_url=endpoint_url,
            config=boto_config,
        )


def upload_image_to_s3(
    local_path: str, s3_client, bucket_name: str, cdn_domain: str
) -> str | None:
    """ローカル画像をS3にアップロードしてURLを返す

    Args:
        local_path: SEED_IMAGES_DIRからの相対パス（例: 'qr-cube/main.jpg'）
        s3_client: boto3 S3クライアント
        bucket_name: S3バケット名
        cdn_domain: CloudFrontドメイン名

    Returns:
        str | None: アップロード成功時はCloudFront URL、失敗時はNone
    """
    file_path = SEED_IMAGES_DIR / local_path
    if not file_path.exists():
        return None

    # 拡張子からContent-Typeを取得
    extension = file_path.suffix.lower()
    content_type = EXTENSION_TO_CONTENT_TYPE.get(extension)
    if not content_type:
        print(f'  警告: 未対応の画像形式です: {extension}')
        return None

    # ユニークなS3キーを生成
    unique_id = uuid.uuid4().hex[:12]
    s3_key = f'products/{unique_id}{extension}'

    try:
        # S3にアップロード
        with open(file_path, 'rb') as f:
            s3_client.put_object(
                Bucket=bucket_name,
                Key=s3_key,
                Body=f,
                ContentType=content_type,
            )

        # CloudFront URLを返す
        if cdn_domain:
            return f'https://{cdn_domain}/{s3_key}'
        else:
            return f'https://{bucket_name}.s3.amazonaws.com/{s3_key}'

    except Exception as e:
        print(f'  S3アップロードエラー ({local_path}): {e}')
        return None


def seed_products(session: Session) -> None:  # noqa: C901
    """商品データをシード"""
    print('商品データをシード中...')

    # 設定を取得
    settings = get_settings()
    s3_client = None
    bucket_name = settings.aws_s3_bucket_name
    cdn_domain = settings.cdn_domain_name

    # S3アップロードが可能かチェック
    if bucket_name:
        try:
            s3_client = get_s3_client()
            print(f'  S3バケット: {bucket_name}')
            if cdn_domain:
                print(f'  CDNドメイン: {cdn_domain}')
        except Exception as e:
            print(f'  警告: S3クライアント初期化失敗: {e}')
            s3_client = None

    # 既存データを削除（外部キー制約の順序に注意）
    session.query(ProductRelationModel).delete()
    session.query(ProductFaqModel).delete()
    session.query(ProductFeatureModel).delete()
    session.query(ProductSpecModel).delete()
    session.query(ProductOptionValueModel).delete()
    session.query(ProductOptionModel).delete()
    session.query(ProductImageModel).delete()
    # 商品を参照しているテーブルを先に削除
    session.query(UploadModel).delete()
    session.query(OrderItemModel).delete()
    session.query(OrderModel).delete()
    session.query(CartItemModel).delete()
    session.query(ProductModel).delete()
    session.query(ProductMasterModel).delete()
    session.commit()
    print('  既存データを削除しました')

    # 商品マスタを登録
    for master_data in PRODUCT_MASTERS:
        master = ProductMasterModel(**master_data)
        session.add(master)
    session.commit()
    print(f'  商品マスタを {len(PRODUCT_MASTERS)} 件登録しました')

    # 商品を登録
    for product_data in PRODUCTS:
        product = ProductModel(**product_data)
        session.add(product)
    session.commit()
    print(f'  商品を {len(PRODUCTS)} 件登録しました')

    # 商品画像を登録
    uploaded_count = 0
    skipped_count = 0
    for image_data in PRODUCT_IMAGES:
        local_path = image_data.get('local_path')
        s3_url = None

        # local_pathがあればS3にアップロード
        if local_path and s3_client:
            s3_url = upload_image_to_s3(local_path, s3_client, bucket_name, cdn_domain)
            if s3_url:
                uploaded_count += 1
            else:
                skipped_count += 1
                continue  # 画像ファイルがない場合はスキップ

        if not s3_url:
            # local_pathがない、またはS3が設定されていない場合はスキップ
            skipped_count += 1
            continue

        image = ProductImageModel(
            product_id=image_data['product_id'],
            s3_url=s3_url,
            alt=image_data.get('alt'),
            is_main=image_data.get('is_main', False),
            sort_order=image_data.get('sort_order', 0),
        )
        session.add(image)
    session.commit()
    print(f'  商品画像を {uploaded_count} 件アップロード・登録しました')
    if skipped_count > 0:
        print(f'  商品画像を {skipped_count} 件スキップしました（画像ファイルなし）')

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
        # uploadsを削除（order_itemsへの外部キー制約）
        order_ids = session.query(OrderModel.id).filter(
            OrderModel.user_id.in_(existing_user_ids)
        )
        order_item_ids = session.query(OrderItemModel.id).filter(
            OrderItemModel.order_id.in_(order_ids)
        )
        session.query(UploadModel).filter(
            UploadModel.order_item_id.in_(order_item_ids)
        ).delete(synchronize_session=False)
        # 注文明細を削除
        session.query(OrderItemModel).filter(
            OrderItemModel.order_id.in_(order_ids)
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
