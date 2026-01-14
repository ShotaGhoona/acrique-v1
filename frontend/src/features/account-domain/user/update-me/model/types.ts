export interface UpdateProfileFormData {
  name?: string;
  name_kana?: string;
  phone?: string;
  company?: string;
}

export interface UpdateProfileError {
  message: string;
  field?: string;
}
