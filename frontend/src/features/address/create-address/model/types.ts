export interface CreateAddressFormData {
  label?: string;
  name: string;
  postal_code: string;
  prefecture: string;
  city: string;
  address1: string;
  address2?: string;
  phone: string;
  is_default?: boolean;
}

export interface CreateAddressError {
  message: string;
  field?: string;
}
