export interface ChangePasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordError {
  message: string;
  field?: string;
}
