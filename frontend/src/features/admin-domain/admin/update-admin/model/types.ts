import type { AdminRole } from '@/entities/admin-domain/admin/model/types';

/**
 * 管理者更新フォームの入力型
 *
 * passwordは変更する場合のみ入力
 */
export interface UpdateAdminFormData {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
  is_active: boolean;
}

/**
 * UpdateAdminFormDataの初期値
 */
export const updateAdminFormDataInitial: UpdateAdminFormData = {
  email: '',
  password: '',
  name: '',
  role: 'staff',
  is_active: true,
};
