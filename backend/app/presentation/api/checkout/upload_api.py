"""入稿データAPIエンドポイント"""

from fastapi import APIRouter, Depends, status

from app.application.use_cases.checkout.upload_usecase import UploadUsecase
from app.di.checkout.upload import get_upload_usecase
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
)
from app.presentation.schemas.checkout.upload_schemas import (
    CreateUploadRequest,
    CreateUploadResponse,
    DeleteUploadResponse,
    GetPresignedUrlRequest,
    GetPresignedUrlResponse,
    GetUploadListResponse,
    GetUploadResponse,
    LinkUploadsRequest,
    LinkUploadsResponse,
)

router = APIRouter(prefix='/uploads', tags=['入稿'])


@router.post(
    '/presigned',
    response_model=GetPresignedUrlResponse,
    status_code=status.HTTP_200_OK,
)
def get_presigned_url(
    request: GetPresignedUrlRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    upload_usecase: UploadUsecase = Depends(get_upload_usecase),
) -> GetPresignedUrlResponse:
    """Presigned URL取得エンドポイント

    S3へのアップロード用署名付きURLを取得する。
    """
    output_dto = upload_usecase.get_presigned_url(current_user.id, request.to_dto())
    return GetPresignedUrlResponse.from_dto(output_dto)


@router.post(
    '',
    response_model=CreateUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_upload(
    request: CreateUploadRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    upload_usecase: UploadUsecase = Depends(get_upload_usecase),
) -> CreateUploadResponse:
    """アップロード完了登録エンドポイント

    S3へのアップロード完了後に呼び出し、DBに入稿データを登録する。
    """
    output_dto = upload_usecase.create_upload(current_user.id, request.to_dto())
    return CreateUploadResponse.from_dto(output_dto)


@router.get(
    '',
    response_model=GetUploadListResponse,
    status_code=status.HTTP_200_OK,
)
def get_upload_list(
    current_user: User = Depends(get_current_user_from_cookie),
    upload_usecase: UploadUsecase = Depends(get_upload_usecase),
) -> GetUploadListResponse:
    """入稿データ一覧取得エンドポイント

    自分のアップロード一覧を取得する。
    """
    output_dto = upload_usecase.get_upload_list(current_user.id)
    return GetUploadListResponse.from_dto(output_dto)


@router.get(
    '/{upload_id}',
    response_model=GetUploadResponse,
    status_code=status.HTTP_200_OK,
)
def get_upload(
    upload_id: int,
    current_user: User = Depends(get_current_user_from_cookie),
    upload_usecase: UploadUsecase = Depends(get_upload_usecase),
) -> GetUploadResponse:
    """入稿データ詳細取得エンドポイント

    自分の入稿データ詳細を取得する。
    """
    output_dto = upload_usecase.get_upload(current_user.id, upload_id)
    return GetUploadResponse.from_dto(output_dto)


@router.delete(
    '/{upload_id}',
    response_model=DeleteUploadResponse,
    status_code=status.HTTP_200_OK,
)
def delete_upload(
    upload_id: int,
    current_user: User = Depends(get_current_user_from_cookie),
    upload_usecase: UploadUsecase = Depends(get_upload_usecase),
) -> DeleteUploadResponse:
    """入稿データ削除エンドポイント

    自分の入稿データを削除する。
    注文に紐付けられた入稿データは削除できない（statusがpendingの場合のみ削除可能）。
    S3からもオブジェクトを削除する。
    """
    output_dto = upload_usecase.delete_upload(current_user.id, upload_id)
    return DeleteUploadResponse.from_dto(output_dto)


# === 注文明細への紐付け ===
# このAPIは orders/ プレフィックス配下に配置するため、別途order_api.pyで実装するか、
# またはここで別ルーターとして定義する

order_uploads_router = APIRouter(prefix='/orders', tags=['入稿'])


@order_uploads_router.put(
    '/{order_id}/items/{item_id}/uploads',
    response_model=LinkUploadsResponse,
    status_code=status.HTTP_200_OK,
)
def link_uploads_to_order_item(
    order_id: int,
    item_id: int,
    request: LinkUploadsRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    upload_usecase: UploadUsecase = Depends(get_upload_usecase),
) -> LinkUploadsResponse:
    """注文明細への入稿紐付けエンドポイント

    入稿データを注文明細に紐付ける。
    - uploads.order_id と uploads.order_item_id を設定
    - uploads.status を pending → submitted に変更
    """
    output_dto = upload_usecase.link_uploads_to_order_item(
        current_user.id,
        order_id,
        item_id,
        request.to_dto(),
    )
    return LinkUploadsResponse.from_dto(output_dto)
