/**
 * Stripeエラーコードに対応する日本語メッセージ
 */
const ERROR_MESSAGES: Record<string, string> = {
  // カード関連エラー
  card_declined: 'カードが拒否されました。別のカードをお試しください。',
  expired_card: 'カードの有効期限が切れています。',
  incorrect_cvc: 'セキュリティコードが正しくありません。',
  incorrect_number: 'カード番号が正しくありません。',
  invalid_expiry_month: '有効期限（月）が正しくありません。',
  invalid_expiry_year: '有効期限（年）が正しくありません。',
  invalid_number: 'カード番号が無効です。',
  // 残高・処理エラー
  insufficient_funds: '残高が不足しています。',
  processing_error: '処理中にエラーが発生しました。もう一度お試しください。',
  // 認証エラー
  authentication_required: '認証が必要です。',
  // その他
  generic_decline: 'カードが拒否されました。',
  lost_card: 'カードが紛失として報告されています。',
  stolen_card: 'カードが盗難として報告されています。',
};

/**
 * エラーコードから日本語メッセージを取得
 * @param code Stripeエラーコード
 * @returns 日本語エラーメッセージ
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? '決済に失敗しました。もう一度お試しください。';
}
