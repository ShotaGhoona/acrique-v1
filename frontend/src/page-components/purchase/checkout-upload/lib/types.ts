import type { UploadRequirements } from '@/shared/domain/upload/model/types';

/** スロットキー（商品ID + 個数インデックス） */
export type SlotKey = `${number}-${number}`;

/** 入力値 */
export interface InputValue {
  key: string;
  type: 'text' | 'url' | 'date' | 'file';
  value: string;
  fileId?: number;
  fileName?: string;
}

/** 入稿スロット情報 */
export interface UploadSlot {
  itemId: number;
  quantityIndex: number;
  slotKey: SlotKey;
  productName: string;
  uploadRequirements: UploadRequirements;
}

/** 入稿が必要な注文アイテム */
export interface UploadRequiredItem {
  id: number;
  quantity: number;
  product_name: string;
  product_name_ja: string | null;
  upload_requirements: UploadRequirements;
}
