import type { UploadType } from '@/shared/domain/upload/model/types';
import type { Upload } from '@/entities/checkout-domain/upload/model/types';
import type {
  SlotKey,
  UploadSlot,
  UploadedFile,
  UploadRequiredItem,
} from './types';

/**
 * UploadTypeをマッピング（不正な値はデフォルトに変換）
 */
export function mapUploadType(type: UploadType | null): UploadType {
  if (type === 'logo' || type === 'qr' || type === 'photo' || type === 'text') {
    return type;
  }
  return 'logo';
}

/**
 * 注文アイテムから入稿スロットを生成
 * 各商品の数量分だけスロットを作成
 */
export function createUploadSlots(items: UploadRequiredItem[]): UploadSlot[] {
  const slots: UploadSlot[] = [];

  for (const item of items) {
    for (let i = 1; i <= item.quantity; i++) {
      slots.push({
        itemId: item.id,
        quantityIndex: i,
        slotKey: `${item.id}-${i}`,
        productName: item.product_name_ja || item.product_name,
        uploadType: mapUploadType(item.upload_type),
      });
    }
  }

  return slots;
}

/**
 * 入稿完了しているスロット数をカウント
 */
export function countCompletedSlots(
  slots: UploadSlot[],
  uploadedFileIds: Record<SlotKey, number[]>,
): number {
  return slots.filter(
    (slot) => (uploadedFileIds[slot.slotKey]?.length ?? 0) > 0,
  ).length;
}

/**
 * 特定スロットのアップロード済みファイル一覧を取得
 */
export function getUploadedFilesForSlot(
  slotKey: SlotKey,
  uploadedFileIds: Record<SlotKey, number[]>,
  allUploads: Upload[],
): UploadedFile[] {
  const ids = uploadedFileIds[slotKey] ?? [];
  return allUploads
    .filter((u) => ids.includes(u.id))
    .map((u) => ({
      id: u.id,
      file_name: u.file_name,
      file_url: u.file_url,
      upload_type: u.upload_type,
    }));
}

/**
 * 商品ごとにスロットをグループ化
 */
export function groupSlotsByItem(
  items: UploadRequiredItem[],
  slots: UploadSlot[],
) {
  return items.map((item) => ({
    item,
    slots: slots.filter((slot) => slot.itemId === item.id),
  }));
}
