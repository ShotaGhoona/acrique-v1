import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '@/entities/payment/api/payment-api';

/**
 * PaymentIntent作成Hook
 * 注文IDを渡してStripe PaymentIntentを作成し、client_secretを取得する
 */
export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (orderId: number) =>
      paymentApi.createPaymentIntent({ order_id: orderId }),
    onError: (error: unknown) => {
      console.error('Create payment intent failed:', error);
    },
  });
}
