"""管理者管理APIエンドポイント"""

from fastapi import APIRouter, Depends, Query, Request, status

from app.application.schemas.admin_admin_schemas import GetAdminsInputDTO
from app.application.use_cases.admin_admin_usecase import AdminAdminUsecase
from app.di.admin_admin import get_admin_admin_usecase
from app.domain.entities.admin import AdminRole
from app.infrastructure.security.admin_security import (
    AdminAuth,
    get_current_admin_from_cookie,
)
from app.presentation.schemas.admin_admin_schemas import (
    CreateAdminRequest,
    CreateAdminResponse,
    DeleteAdminResponse,
    GetAdminsResponse,
    UpdateAdminRequest,
    UpdateAdminResponse,
)

router = APIRouter(prefix='/admin/admins', tags=['管理者管理'])


@router.get('', response_model=GetAdminsResponse, status_code=status.HTTP_200_OK)
def get_admins(
    role: AdminRole | None = Query(None, description='権限フィルタ'),
    is_active: bool | None = Query(None, description='有効フラグフィルタ'),
    limit: int = Query(20, ge=1, le=100, description='取得件数'),
    offset: int = Query(0, ge=0, description='オフセット'),
    current_admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminAdminUsecase = Depends(get_admin_admin_usecase),
) -> GetAdminsResponse:
    """管理者一覧取得

    管理者の一覧を取得する。権限・有効フラグで絞り込み可能。
    """
    input_dto = GetAdminsInputDTO(
        role=role, is_active=is_active, limit=limit, offset=offset
    )
    output_dto = usecase.get_admins(input_dto)
    return GetAdminsResponse.from_dto(output_dto)


@router.post('', response_model=CreateAdminResponse, status_code=status.HTTP_201_CREATED)
def create_admin(
    request_body: CreateAdminRequest,
    request: Request,
    current_admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminAdminUsecase = Depends(get_admin_admin_usecase),
) -> CreateAdminResponse:
    """管理者作成

    新しい管理者を作成する。
    super_adminの作成はsuper_adminのみ可能。
    adminはstaffのみ作成可能。
    """
    ip_address = request.client.host if request.client else None
    output_dto = usecase.create_admin(current_admin.id, request_body.to_dto(), ip_address)
    return CreateAdminResponse.from_dto(output_dto)


@router.put(
    '/{admin_id}', response_model=UpdateAdminResponse, status_code=status.HTTP_200_OK
)
def update_admin(
    admin_id: int,
    request_body: UpdateAdminRequest,
    request: Request,
    current_admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminAdminUsecase = Depends(get_admin_admin_usecase),
) -> UpdateAdminResponse:
    """管理者更新

    指定した管理者の情報を更新する。
    自分自身の編集は可能。
    他の管理者の編集はsuper_admin/adminのみ可能。
    """
    ip_address = request.client.host if request.client else None
    output_dto = usecase.update_admin(
        current_admin.id, admin_id, request_body.to_dto(), ip_address
    )
    return UpdateAdminResponse.from_dto(output_dto)


@router.delete(
    '/{admin_id}', response_model=DeleteAdminResponse, status_code=status.HTTP_200_OK
)
def delete_admin(
    admin_id: int,
    request: Request,
    current_admin: AdminAuth = Depends(get_current_admin_from_cookie),
    usecase: AdminAdminUsecase = Depends(get_admin_admin_usecase),
) -> DeleteAdminResponse:
    """管理者削除

    指定した管理者を削除する。
    自分自身は削除不可。
    super_adminはsuper_admin以外を削除可能。
    adminはstaffのみ削除可能。
    """
    ip_address = request.client.host if request.client else None
    output_dto = usecase.delete_admin(current_admin.id, admin_id, ip_address)
    return DeleteAdminResponse.from_dto(output_dto)
