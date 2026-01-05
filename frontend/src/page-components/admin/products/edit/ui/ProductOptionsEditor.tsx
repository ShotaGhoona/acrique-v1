'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/shadcn/ui/dialog';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Switch } from '@/shared/ui/shadcn/ui/switch';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn/ui/collapsible';
import { useUpdateProductOptions } from '@/features/admin-product/update-options/lib/use-update-product-options';
import type { AdminProductOption, AdminProductOptionValue } from '@/entities/admin-product/model/types';

// フォーム用の型（新規追加時はidがnull）
interface OptionValueFormItem {
  id: number | null;
  label: string;
  price_diff: number;
  description: string | null;
  sort_order: number;
}

interface OptionFormItem {
  id: number | null;
  name: string;
  is_required: boolean;
  sort_order: number;
  values: OptionValueFormItem[];
}

interface ProductOptionsEditorProps {
  productId: string;
  options: AdminProductOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductOptionsEditor({
  productId,
  options: initialOptions,
  open,
  onOpenChange,
}: ProductOptionsEditorProps) {
  const [options, setOptions] = useState<OptionFormItem[]>(initialOptions);
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set());

  const updateOptionsMutation = useUpdateProductOptions();

  // ダイアログが開いたときに初期値をリセット
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setOptions(initialOptions);
    }
    onOpenChange(isOpen);
  };

  const toggleExpanded = (index: number) => {
    setExpandedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const addOption = () => {
    setOptions([
      ...options,
      {
        id: null,
        name: '',
        is_required: false,
        sort_order: options.length,
        values: [],
      },
    ]);
    setExpandedOptions((prev) => new Set([...prev, options.length]));
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, updates: Partial<OptionFormItem>) => {
    setOptions(
      options.map((opt, i) => (i === index ? { ...opt, ...updates } : opt)),
    );
  };

  const addOptionValue = (optionIndex: number) => {
    const option = options[optionIndex];
    updateOption(optionIndex, {
      values: [
        ...option.values,
        {
          id: null,
          label: '',
          price_diff: 0,
          description: null,
          sort_order: option.values.length,
        },
      ],
    });
  };

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    const option = options[optionIndex];
    updateOption(optionIndex, {
      values: option.values.filter((_, i) => i !== valueIndex),
    });
  };

  const updateOptionValue = (
    optionIndex: number,
    valueIndex: number,
    updates: Partial<OptionValueFormItem>,
  ) => {
    const option = options[optionIndex];
    updateOption(optionIndex, {
      values: option.values.map((val, i) =>
        i === valueIndex ? { ...val, ...updates } : val,
      ),
    });
  };

  const handleSave = () => {
    // sort_orderを再設定
    const sortedOptions = options.map((opt, i) => ({
      ...opt,
      sort_order: i,
      values: opt.values.map((val, j) => ({ ...val, sort_order: j })),
    }));

    updateOptionsMutation.mutate(
      { productId, data: { options: sortedOptions } },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '±0';
    return amount > 0 ? `+¥${amount.toLocaleString()}` : `-¥${Math.abs(amount).toLocaleString()}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>オプション設定</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {options.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground'>
              オプションがありません
            </div>
          ) : (
            options.map((option, optionIndex) => (
              <Card key={optionIndex}>
                <Collapsible
                  open={expandedOptions.has(optionIndex)}
                  onOpenChange={() => toggleExpanded(optionIndex)}
                >
                  <CardHeader className='p-3'>
                    <div className='flex items-center gap-2'>
                      <GripVertical className='h-4 w-4 text-muted-foreground' />
                      <CollapsibleTrigger asChild>
                        <Button variant='ghost' size='sm' className='p-1'>
                          {expandedOptions.has(optionIndex) ? (
                            <ChevronUp className='h-4 w-4' />
                          ) : (
                            <ChevronDown className='h-4 w-4' />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <Input
                        value={option.name}
                        onChange={(e) =>
                          updateOption(optionIndex, { name: e.target.value })
                        }
                        placeholder='オプション名（例: サイズ）'
                        className='flex-1'
                      />
                      <div className='flex items-center gap-2'>
                        <Label className='text-xs whitespace-nowrap'>必須</Label>
                        <Switch
                          checked={option.is_required}
                          onCheckedChange={(checked) =>
                            updateOption(optionIndex, { is_required: checked })
                          }
                        />
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeOption(optionIndex)}
                        className='text-destructive'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className='border-t p-3'>
                      <div className='space-y-2'>
                        <div className='text-xs font-medium text-muted-foreground'>
                          選択肢
                        </div>
                        {option.values.map((value, valueIndex) => (
                          <div
                            key={valueIndex}
                            className='flex items-center gap-2 rounded-md bg-muted/50 p-2'
                          >
                            <Input
                              value={value.label}
                              onChange={(e) =>
                                updateOptionValue(optionIndex, valueIndex, {
                                  label: e.target.value,
                                })
                              }
                              placeholder='選択肢名（例: 50mm角）'
                              className='flex-1'
                            />
                            <div className='flex items-center gap-1'>
                              <span className='text-xs text-muted-foreground'>
                                価格差:
                              </span>
                              <Input
                                type='number'
                                value={value.price_diff}
                                onChange={(e) =>
                                  updateOptionValue(optionIndex, valueIndex, {
                                    price_diff: parseInt(e.target.value, 10) || 0,
                                  })
                                }
                                className='w-24'
                              />
                              <span className='text-xs text-muted-foreground'>
                                円
                              </span>
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              onClick={() =>
                                removeOptionValue(optionIndex, valueIndex)
                              }
                              className='h-8 w-8 text-destructive'
                            >
                              <Trash2 className='h-3 w-3' />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => addOptionValue(optionIndex)}
                          className='w-full'
                        >
                          <Plus className='mr-1 h-3 w-3' />
                          選択肢を追加
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}

          <Button
            type='button'
            variant='outline'
            onClick={addOption}
            className='w-full'
          >
            <Plus className='mr-2 h-4 w-4' />
            オプションを追加
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
            disabled={updateOptionsMutation.isPending}
          >
            {updateOptionsMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
