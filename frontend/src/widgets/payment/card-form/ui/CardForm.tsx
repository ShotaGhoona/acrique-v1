'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { getErrorMessage } from '@/features/payment/create-payment-intent/lib/error-messages';

interface CardFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      fontFamily: '"Noto Sans JP", sans-serif',
      color: '#171717',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#dc2626',
      iconColor: '#dc2626',
    },
  },
  hidePostalCode: true,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(price);
}

export function CardForm({
  clientSecret,
  amount,
  onSuccess,
  onError,
}: CardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        },
      );

      if (error) {
        const message = getErrorMessage(error.code ?? 'unknown');
        onError(message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch {
      onError('予期せぬエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">カード情報</label>
          <div className="rounded-sm border border-border p-4 focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground">
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={(event) => {
                if (event.error) {
                  setCardError(event.error.message);
                } else {
                  setCardError(null);
                }
              }}
            />
          </div>
          {cardError && (
            <p className="mt-2 text-sm text-destructive">{cardError}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? '処理中...' : `${formatPrice(amount)}を支払う`}
        </Button>
      </div>
    </form>
  );
}
