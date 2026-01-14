import httpClient from '@/shared/api/client/http-client';
import type {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
} from '../model/types';

/**
 * 決済API
 */
export const paymentApi = {
  /**
   * PaymentIntent作成
   * @param data order_idを含むリクエスト
   * @returns client_secret, payment_intent_id, amount
   */
  async createPaymentIntent(
    data: CreatePaymentIntentRequest,
  ): Promise<CreatePaymentIntentResponse> {
    const response = await httpClient.post<CreatePaymentIntentResponse>(
      '/api/payments/intent',
      data,
    );
    return response.data;
  },
};
