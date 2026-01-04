'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/shadcn/ui/dialog';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Textarea } from '@/shared/ui/shadcn/ui/textarea';
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card';
import { useUpdateProductFaqs } from '@/features/admin-product/update-faqs/lib/use-update-product-faqs';
import type { ProductFaq } from '@/entities/product/model/types';

// フォーム用の型（idはオプション）
interface FaqFormItem {
  id?: number;
  question: string;
  answer: string;
  sort_order: number;
}

interface ProductFaqsEditorProps {
  productId: string;
  faqs: ProductFaq[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductFaqsEditor({
  productId,
  faqs: initialFaqs,
  open,
  onOpenChange,
}: ProductFaqsEditorProps) {
  const [faqs, setFaqs] = useState<FaqFormItem[]>(initialFaqs);

  const updateFaqsMutation = useUpdateProductFaqs();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setFaqs(initialFaqs);
    }
    onOpenChange(isOpen);
  };

  const addFaq = () => {
    setFaqs([
      ...faqs,
      {
        question: '',
        answer: '',
        sort_order: faqs.length,
      },
    ]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, updates: Partial<FaqFormItem>) => {
    setFaqs(
      faqs.map((faq, i) => (i === index ? { ...faq, ...updates } : faq)),
    );
  };

  const handleSave = () => {
    const sortedFaqs = faqs.map((faq, i) => ({
      ...faq,
      sort_order: i,
    }));

    updateFaqsMutation.mutate(
      { productId, data: { faqs: sortedFaqs } },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>よくある質問（FAQ）</DialogTitle>
        </DialogHeader>

        <div className='space-y-3 py-4'>
          {faqs.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground'>
              FAQがありません
            </div>
          ) : (
            faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className='p-3'>
                  <div className='flex items-start gap-2'>
                    <GripVertical className='mt-2 h-4 w-4 flex-shrink-0 text-muted-foreground' />
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <HelpCircle className='h-4 w-4 text-primary' />
                        <span className='text-xs font-medium'>質問</span>
                      </div>
                      <Input
                        value={faq.question}
                        onChange={(e) =>
                          updateFaq(index, { question: e.target.value })
                        }
                        placeholder='例: 納期はどのくらいですか？'
                      />
                      <div className='text-xs font-medium text-muted-foreground'>
                        回答
                      </div>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) =>
                          updateFaq(index, { answer: e.target.value })
                        }
                        placeholder='例: 通常5営業日以内に発送いたします。'
                        rows={2}
                      />
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeFaq(index)}
                      className='mt-1 h-8 w-8 flex-shrink-0 text-destructive'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          <Button
            type='button'
            variant='outline'
            onClick={addFaq}
            className='w-full'
          >
            <Plus className='mr-2 h-4 w-4' />
            FAQを追加
          </Button>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            キャンセル
          </Button>
          <Button
            type='button'
            onClick={handleSave}
            disabled={updateFaqsMutation.isPending}
          >
            {updateFaqsMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
