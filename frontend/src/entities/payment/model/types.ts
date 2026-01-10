// === PaymentIntent作成 ===
export interface CreatePaymentIntentRequest {
  order_id: number;
}

export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
}

// === 決済エラー ===
export interface PaymentError {
  code: string;
  message: string;
}
