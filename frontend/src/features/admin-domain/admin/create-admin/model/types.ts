import type { AdminRole } from '@/entities/admin-domain/admin/model/types';

/**
 * 管理者作成フォームの入力型
 */
export interface CreateAdminFormData {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
}

/**
 * CreateAdminFormDataの初期値
 */
export const createAdminFormDataInitial: CreateAdminFormData = {
  email: '',
  password: '',
  name: '',
  role: 'staff',
};
