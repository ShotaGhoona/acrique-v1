import type { UploadType } from '@/shared/domain/upload/model/types';

/** スロットキー（商品ID + 個数インデックス） */
export type SlotKey = `${number}-${number}`;

/** アップロード済みファイル情報 */
export interface UploadedFile {
  id: number;
  file_name: string;
  file_url: string;
  upload_type: string | null;
}

/** 入稿スロット情報 */
export interface UploadSlot {
  itemId: number;
  quantityIndex: number;
  slotKey: SlotKey;
  productName: string;
  uploadType: UploadType;
}

/** 入稿が必要な注文アイテム */
export interface UploadRequiredItem {
  id: number;
  quantity: number;
  product_name: string;
  product_name_ja: string | null;
  upload_type: UploadType | null;
}
