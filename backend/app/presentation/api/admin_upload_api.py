"""Admin入稿データ管理APIエンドポイント"""

from datetime import datetime

from fastapi import APIRouter, Depends, Query

from app.application.schemas.admin_upload_schemas import GetAdminUploadsInputDTO
from app.application.use_cases.admin_upload_usecase import AdminUploadUsecase
from app.di.admin_upload import get_admin_upload_usecase
from app.infrastructure.security.admin_security import (
    AdminAuth,
    get_current_admin_from_cookie,
)
from app.presentation.schemas.admin_upload_schemas import (
    AdminUploadResponse,
    ApproveUploadRequest,
    ApproveUploadResponse,
    GetAdminUploadResponse,
    GetAdminUploadsResponse,
    RejectUploadRequest,
    RejectUploadResponse,
)

router = APIRouter(prefix='/admin/uploads', tags=['Admin Uploads'])


@router.get('', response_model=GetAdminUploadsResponse)
async def get_uploads(
    status: str | None = Query(None, description='ステータスフィルタ'),
    user_id: int | None = Query(None, description='ユーザーIDフィルタ'),
    order_id: int | None = Query(None, description='注文IDフィルタ'),
    date_from: datetime | None = Query(None, description='開始日'),
    date_to: datetime | None = Query(None, description='終了日'),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminUploadUsecase = Depends(get_admin_upload_usecase),
) -> GetAdminUploadsResponse:
    """入稿データ一覧を取得"""
    input_dto = GetAdminUploadsInputDTO(
        status=status,
        user_id=user_id,
        order_id=order_id,
        date_from=date_from,
        date_to=date_to,
        limit=limit,
        offset=offset,
    )
    output = usecase.get_uploads(input_dto)

    return GetAdminUploadsResponse(
        uploads=[AdminUploadResponse.from_dto(upload) for upload in output.uploads],
        total=output.total,
        limit=output.limit,
        offset=output.offset,
    )


@router.get('/{upload_id}', response_model=GetAdminUploadResponse)
async def get_upload(
    upload_id: int,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminUploadUsecase = Depends(get_admin_upload_usecase),
) -> GetAdminUploadResponse:
    """入稿データ詳細を取得"""
    output = usecase.get_upload(upload_id)

    return GetAdminUploadResponse(upload=AdminUploadResponse.from_dto(output.upload))


@router.post('/{upload_id}/approve', response_model=ApproveUploadResponse)
async def approve_upload(
    upload_id: int,
    request: ApproveUploadRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminUploadUsecase = Depends(get_admin_upload_usecase),
) -> ApproveUploadResponse:
    """入稿データを承認"""
    output = usecase.approve_upload(admin.id, upload_id, request.to_dto())

    return ApproveUploadResponse(
        upload=AdminUploadResponse.from_dto(output.upload),
        message=output.message,
        order_status_updated=output.order_status_updated,
    )


@router.post('/{upload_id}/reject', response_model=RejectUploadResponse)
async def reject_upload(
    upload_id: int,
    request: RejectUploadRequest,
    admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminUploadUsecase = Depends(get_admin_upload_usecase),
) -> RejectUploadResponse:
    """入稿データを差し戻し"""
    output = usecase.reject_upload(admin.id, upload_id, request.to_dto())

    return RejectUploadResponse(
        upload=AdminUploadResponse.from_dto(output.upload),
        message=output.message,
        order_status_updated=output.order_status_updated,
    )
