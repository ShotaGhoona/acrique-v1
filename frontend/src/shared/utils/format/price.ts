/**
 * 価格を日本円フォーマットで文字列に変換
 * @param price - 価格（数値）
 * @returns フォーマットされた価格文字列（例: ¥1,000）
 */
export const formatPrice = (price: number): string => {
  return `¥${price.toLocaleString()}`;
};
