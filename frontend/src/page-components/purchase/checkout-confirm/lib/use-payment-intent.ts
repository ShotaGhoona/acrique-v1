'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreatePaymentIntent } from '@/features/checkout-domain/payment/create-payment-intent/lib/use-create-payment-intent';
import type { Order } from '@/entities/checkout-domain/order/model/types';

interface UsePaymentIntentResult {
  clientSecret: string | null;
  paymentAmount: number;
  isCreating: boolean;
}

/**
 * PaymentIntentの初期化を管理するカスタムフック
 * - 注文データが取得できたら自動的にPaymentIntentを作成
 * - 二重作成を防止
 * - エラー時はcheckoutページにリダイレクト
 */
export function usePaymentIntent(
  orderId: string | null,
  order: Order | undefined,
): UsePaymentIntentResult {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const paymentIntentCreated = useRef(false);

  const { mutate: createPaymentIntent, isPending } = useCreatePaymentIntent();

  useEffect(() => {
    if (!orderId) {
      router.push('/checkout');
      return;
    }

    // 既にclientSecretがある、リクエスト中、または既に作成済みの場合はスキップ
    if (clientSecret || isPending || paymentIntentCreated.current) {
      return;
    }

    if (order) {
      paymentIntentCreated.current = true;
      createPaymentIntent(Number(orderId), {
        onSuccess: (data) => {
          setClientSecret(data.client_secret);
          setPaymentAmount(data.amount);
        },
        onError: () => {
          paymentIntentCreated.current = false;
          toast.error('決済の準備に失敗しました');
          router.push('/checkout');
        },
      });
    }
  }, [orderId, order, clientSecret, isPending, createPaymentIntent, router]);

  return {
    clientSecret,
    paymentAmount,
    isCreating: isPending,
  };
}
