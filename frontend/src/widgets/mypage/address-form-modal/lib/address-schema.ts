import { z } from 'zod';
import type { Address } from '@/entities/account-domain/address/model/types';

export const addressSchema = z.object({
  label: z.string().optional(),
  name: z.string().min(1, 'お名前を入力してください'),
  postal_code: z.string().min(1, '郵便番号を入力してください'),
  prefecture: z.string().min(1, '都道府県を入力してください'),
  city: z.string().min(1, '市区町村を入力してください'),
  address1: z.string().min(1, '番地を入力してください'),
  address2: z.string().optional(),
  phone: z.string().min(1, '電話番号を入力してください'),
  is_default: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface ZipcloudResponse {
  status: number;
  message: string | null;
  results:
    | {
        zipcode: string;
        prefcode: string;
        address1: string;
        address2: string;
        address3: string;
      }[]
    | null;
}

export async function searchAddressByPostalCode(postalCode: string): Promise<{
  prefecture: string;
  city: string;
} | null> {
  const cleanedCode = postalCode.replace(/-/g, '');
  if (cleanedCode.length !== 7) return null;

  try {
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanedCode}`,
    );
    const data: ZipcloudResponse = await response.json();

    if (data.status === 200 && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        prefecture: result.address1,
        city: result.address2 + result.address3,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function addressToFormData(address: Address): AddressFormData {
  return {
    label: address.label ?? '',
    name: address.name,
    postal_code: address.postal_code,
    prefecture: address.prefecture,
    city: address.city,
    address1: address.address1,
    address2: address.address2 ?? '',
    phone: address.phone,
  };
}
