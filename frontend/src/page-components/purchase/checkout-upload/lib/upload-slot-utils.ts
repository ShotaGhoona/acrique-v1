import type {
  SlotKey,
  UploadSlot,
  UploadRequiredItem,
  InputValue,
} from './types';

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
        uploadRequirements: item.upload_requirements,
      });
    }
  }

  return slots;
}

/**
 * スロットの入稿が完了しているか判定
 */
export function isSlotComplete(
  slot: UploadSlot,
  inputValues: Record<SlotKey, InputValue[]>,
): boolean {
  const requirements = slot.uploadRequirements;
  if (!requirements?.inputs || requirements.inputs.length === 0) return true;

  const values = inputValues[slot.slotKey] ?? [];

  for (const input of requirements.inputs) {
    if (!input.required) continue;

    const value = values.find((v) => v.key === input.key);
    if (!value) return false;

    if (input.type === 'file') {
      if (!value.fileId) return false;
    } else {
      if (!value.value || value.value.trim() === '') return false;
    }
  }

  return true;
}

/**
 * 入稿完了しているスロット数をカウント
 */
export function countCompletedSlots(
  slots: UploadSlot[],
  inputValues: Record<SlotKey, InputValue[]>,
): number {
  return slots.filter((slot) => isSlotComplete(slot, inputValues)).length;
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

/**
 * upload_requirementsから入稿タイプのラベルを取得
 */
export function getUploadLabel(item: UploadRequiredItem): string {
  const requirements = item.upload_requirements;
  if (!requirements?.inputs || requirements.inputs.length === 0) {
    return 'データ';
  }

  const inputCount = requirements.inputs.length;
  if (inputCount === 1) {
    return requirements.inputs[0].label;
  }

  return `${inputCount}項目の入稿`;
}
