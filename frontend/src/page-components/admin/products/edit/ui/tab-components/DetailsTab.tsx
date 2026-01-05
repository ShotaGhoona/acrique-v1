'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  HelpCircle,
  Settings2,
  List,
  Star,
  Save,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Textarea } from '@/shared/ui/shadcn/ui/textarea';
import { Switch } from '@/shared/ui/shadcn/ui/switch';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn/ui/collapsible';
import { useUpdateProductOptions } from '@/features/admin-product/update-options/lib/use-update-product-options';
import { useUpdateProductSpecs } from '@/features/admin-product/update-specs/lib/use-update-product-specs';
import { useUpdateProductFeatures } from '@/features/admin-product/update-features/lib/use-update-product-features';
import { useUpdateProductFaqs } from '@/features/admin-product/update-faqs/lib/use-update-product-faqs';
import type {
  AdminProductOption,
  AdminProductOptionValue,
  AdminProductSpec,
  AdminProductFeature,
  AdminProductFaq,
} from '@/entities/admin-product/model/types';
import type { DetailsTabProps } from '../../model/types';

// フォーム用の型
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

interface SpecFormItem {
  id: number | null;
  label: string;
  value: string;
  sort_order: number;
}

interface FeatureFormItem {
  id: number | null;
  title: string;
  description: string;
  sort_order: number;
}

interface FaqFormItem {
  id: number | null;
  question: string;
  answer: string;
  sort_order: number;
}

export function DetailsTab({ productId, product }: DetailsTabProps) {
  // オプション
  const [options, setOptions] = useState<OptionFormItem[]>(product.options);
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set());
  const updateOptionsMutation = useUpdateProductOptions();

  // スペック
  const [specs, setSpecs] = useState<SpecFormItem[]>(product.specs);
  const updateSpecsMutation = useUpdateProductSpecs();

  // 特長
  const [features, setFeatures] = useState<FeatureFormItem[]>(product.features);
  const updateFeaturesMutation = useUpdateProductFeatures();

  // FAQ
  const [faqs, setFaqs] = useState<FaqFormItem[]>(product.faqs);
  const updateFaqsMutation = useUpdateProductFaqs();

  // 商品データが変更されたら同期
  useEffect(() => {
    setOptions(product.options);
    setSpecs(product.specs);
    setFeatures(product.features);
    setFaqs(product.faqs);
  }, [product]);

  // === オプション操作 ===
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

  const handleSaveOptions = () => {
    const sortedOptions = options.map((opt, i) => ({
      ...opt,
      sort_order: i,
      values: opt.values.map((val, j) => ({ ...val, sort_order: j })),
    }));
    updateOptionsMutation.mutate({ productId, data: { options: sortedOptions } });
  };

  // === スペック操作 ===
  const addSpec = () => {
    setSpecs([
      ...specs,
      { id: null, label: '', value: '', sort_order: specs.length },
    ]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, updates: Partial<SpecFormItem>) => {
    setSpecs(
      specs.map((spec, i) => (i === index ? { ...spec, ...updates } : spec)),
    );
  };

  const handleSaveSpecs = () => {
    const sortedSpecs = specs.map((spec, i) => ({ ...spec, sort_order: i }));
    updateSpecsMutation.mutate({ productId, data: { specs: sortedSpecs } });
  };

  // === 特長操作 ===
  const addFeature = () => {
    setFeatures([
      ...features,
      { id: null, title: '', description: '', sort_order: features.length },
    ]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, updates: Partial<FeatureFormItem>) => {
    setFeatures(
      features.map((f, i) => (i === index ? { ...f, ...updates } : f)),
    );
  };

  const handleSaveFeatures = () => {
    const sortedFeatures = features.map((f, i) => ({ ...f, sort_order: i }));
    updateFeaturesMutation.mutate({ productId, data: { features: sortedFeatures } });
  };

  // === FAQ操作 ===
  const addFaq = () => {
    setFaqs([
      ...faqs,
      { id: null, question: '', answer: '', sort_order: faqs.length },
    ]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, updates: Partial<FaqFormItem>) => {
    setFaqs(faqs.map((f, i) => (i === index ? { ...f, ...updates } : f)));
  };

  const handleSaveFaqs = () => {
    const sortedFaqs = faqs.map((f, i) => ({ ...f, sort_order: i }));
    updateFaqsMutation.mutate({ productId, data: { faqs: sortedFaqs } });
  };

  return (
    <div className='space-y-6'>
      {/* オプション設定 */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Settings2 className='h-5 w-5' />
            オプション設定
          </CardTitle>
          <Button
            size='sm'
            onClick={handleSaveOptions}
            disabled={updateOptionsMutation.isPending}
          >
            <Save className='mr-1 h-4 w-4' />
            {updateOptionsMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </CardHeader>
        <CardContent className='space-y-4'>
          {options.length === 0 ? (
            <div className='py-6 text-center text-muted-foreground'>
              オプションがありません
            </div>
          ) : (
            options.map((option, optionIndex) => (
              <Card key={optionIndex} className='bg-muted/30'>
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
                        <Label className='whitespace-nowrap text-xs'>必須</Label>
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
                            className='flex items-center gap-2 rounded-md bg-background p-2'
                          >
                            <Input
                              value={value.label}
                              onChange={(e) =>
                                updateOptionValue(optionIndex, valueIndex, {
                                  label: e.target.value,
                                })
                              }
                              placeholder='選択肢名'
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
                              <span className='text-xs text-muted-foreground'>円</span>
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              onClick={() => removeOptionValue(optionIndex, valueIndex)}
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
          <Button type='button' variant='outline' onClick={addOption} className='w-full'>
            <Plus className='mr-2 h-4 w-4' />
            オプションを追加
          </Button>
        </CardContent>
      </Card>

      {/* スペック */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <List className='h-5 w-5' />
            仕様・スペック
          </CardTitle>
          <Button
            size='sm'
            onClick={handleSaveSpecs}
            disabled={updateSpecsMutation.isPending}
          >
            <Save className='mr-1 h-4 w-4' />
            {updateSpecsMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='grid grid-cols-[auto_1fr_1fr_auto] gap-2 text-xs font-medium text-muted-foreground'>
            <div className='w-6'></div>
            <div>項目名</div>
            <div>値</div>
            <div className='w-8'></div>
          </div>
          {specs.length === 0 ? (
            <div className='py-6 text-center text-muted-foreground'>
              スペックがありません
            </div>
          ) : (
            specs.map((spec, index) => (
              <div
                key={index}
                className='grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2'
              >
                <GripVertical className='h-4 w-4 text-muted-foreground' />
                <Input
                  value={spec.label}
                  onChange={(e) => updateSpec(index, { label: e.target.value })}
                  placeholder='例: サイズ'
                />
                <Input
                  value={spec.value}
                  onChange={(e) => updateSpec(index, { value: e.target.value })}
                  placeholder='例: 50mm × 50mm × 50mm'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => removeSpec(index)}
                  className='h-8 w-8 text-destructive'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))
          )}
          <Button type='button' variant='outline' onClick={addSpec} className='w-full'>
            <Plus className='mr-2 h-4 w-4' />
            スペックを追加
          </Button>
        </CardContent>
      </Card>

      {/* 特長 */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Star className='h-5 w-5' />
            商品の特長
          </CardTitle>
          <Button
            size='sm'
            onClick={handleSaveFeatures}
            disabled={updateFeaturesMutation.isPending}
          >
            <Save className='mr-1 h-4 w-4' />
            {updateFeaturesMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </CardHeader>
        <CardContent className='space-y-3'>
          {features.length === 0 ? (
            <div className='py-6 text-center text-muted-foreground'>
              特長がありません
            </div>
          ) : (
            features.map((feature, index) => (
              <Card key={index} className='bg-muted/30'>
                <CardContent className='p-3'>
                  <div className='flex items-start gap-2'>
                    <GripVertical className='mt-2 h-4 w-4 flex-shrink-0 text-muted-foreground' />
                    <div className='flex-1 space-y-2'>
                      <Input
                        value={feature.title}
                        onChange={(e) =>
                          updateFeature(index, { title: e.target.value })
                        }
                        placeholder='特長タイトル（例: 高品質なアクリル素材）'
                      />
                      <Textarea
                        value={feature.description ?? ''}
                        onChange={(e) =>
                          updateFeature(index, { description: e.target.value })
                        }
                        placeholder='詳細説明（任意）'
                        rows={2}
                      />
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeFeature(index)}
                      className='mt-1 h-8 w-8 flex-shrink-0 text-destructive'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          <Button type='button' variant='outline' onClick={addFeature} className='w-full'>
            <Plus className='mr-2 h-4 w-4' />
            特長を追加
          </Button>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <HelpCircle className='h-5 w-5' />
            よくある質問（FAQ）
          </CardTitle>
          <Button
            size='sm'
            onClick={handleSaveFaqs}
            disabled={updateFaqsMutation.isPending}
          >
            <Save className='mr-1 h-4 w-4' />
            {updateFaqsMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </CardHeader>
        <CardContent className='space-y-3'>
          {faqs.length === 0 ? (
            <div className='py-6 text-center text-muted-foreground'>
              FAQがありません
            </div>
          ) : (
            faqs.map((faq, index) => (
              <Card key={index} className='bg-muted/30'>
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
          <Button type='button' variant='outline' onClick={addFaq} className='w-full'>
            <Plus className='mr-2 h-4 w-4' />
            FAQを追加
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
