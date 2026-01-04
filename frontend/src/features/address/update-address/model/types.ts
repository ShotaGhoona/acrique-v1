export interface UpdateAddressFormData {
  label?: string;
  name?: string;
  postal_code?: string;
  prefecture?: string;
  city?: string;
  address1?: string;
  address2?: string;
  phone?: string;
}

export interface UpdateAddressError {
  message: string;
  field?: string;
}
