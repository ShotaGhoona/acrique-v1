export interface PasswordResetRequestFormData {
  email: string;
}

export interface PasswordResetConfirmFormData {
  token: string;
  new_password: string;
  confirm_password: string;
}
