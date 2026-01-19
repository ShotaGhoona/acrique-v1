/**
 * モデルカテゴリ固定データ
 */

import type { ModelCategory } from '../model/types';

export const modelCategoryLabels: Record<ModelCategory, string> = {
  signature: 'シグネチャー',
  standard: 'スタンダード',
  'free-cut': 'フリーカット',
  structure: 'ストラクチャー',
};

export const modelCategoryColors: Record<
  ModelCategory,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  signature: 'default',
  standard: 'secondary',
  'free-cut': 'outline',
  structure: 'destructive',
};

// ヘルパー関数
export function getModelCategoryLabel(category: ModelCategory): string {
  return modelCategoryLabels[category];
}

export function isValidModelCategory(value: string): value is ModelCategory {
  return ['signature', 'standard', 'free-cut', 'structure'].includes(value);
}
