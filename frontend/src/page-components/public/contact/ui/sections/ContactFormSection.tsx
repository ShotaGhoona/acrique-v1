'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Textarea } from '@/shared/ui/shadcn/ui/textarea';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { SITE_INFO } from '@/shared/config/site-info';

const inquiryTypes = [
  { value: 'product', label: '商品に関するご質問' },
  { value: 'order', label: 'ご注文について' },
  { value: 'corporate', label: '法人・大量注文のご相談' },
  { value: 'other', label: 'その他' },
];

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section className='py-20 lg:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='grid gap-16 lg:grid-cols-5 lg:gap-20'>
          {/* Form */}
          <div className='lg:col-span-3'>
            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* Name & Email */}
              <div className='grid gap-6 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>
                    お名前 <span className='text-accent'>*</span>
                  </Label>
                  <Input
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='山田 太郎'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>
                    メールアドレス <span className='text-accent'>*</span>
                  </Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='example@email.com'
                    required
                  />
                </div>
              </div>

              {/* Phone & Company */}
              <div className='grid gap-6 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>電話番号</Label>
                  <Input
                    id='phone'
                    name='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder='090-1234-5678'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='company'>会社名・店舗名</Label>
                  <Input
                    id='company'
                    name='company'
                    value={formData.company}
                    onChange={handleChange}
                    placeholder='株式会社サンプル'
                  />
                </div>
              </div>

              {/* Inquiry Type */}
              <div className='space-y-2'>
                <Label htmlFor='inquiryType'>
                  お問い合わせ種別 <span className='text-accent'>*</span>
                </Label>
                <select
                  id='inquiryType'
                  name='inquiryType'
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                  className='flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                >
                  <option value=''>選択してください</option>
                  {inquiryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className='space-y-2'>
                <Label htmlFor='message'>
                  お問い合わせ内容 <span className='text-accent'>*</span>
                </Label>
                <Textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  placeholder='お問い合わせ内容をご記入ください。大量注文の場合は、ご希望の商品、サイズ、数量などをお知らせください。'
                  rows={6}
                  required
                />
              </div>

              {/* Privacy Policy */}
              <div className='text-sm text-muted-foreground'>
                <p>
                  お問い合わせいただいた内容は、
                  <a
                    href='/privacy'
                    className='underline underline-offset-4 transition-colors hover:text-foreground'
                  >
                    プライバシーポリシー
                  </a>
                  に基づき適切に管理いたします。
                </p>
              </div>

              {/* Submit */}
              <Button type='submit' size='lg' className='w-full sm:w-auto'>
                送信する
                <Send className='ml-2 h-4 w-4' />
              </Button>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className='lg:col-span-2'>
            <div className='sticky top-8 space-y-8'>
              {/* Response Time */}
              <div className='rounded-sm bg-secondary/50 p-6'>
                <h3 className='font-medium'>返信について</h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  通常、{SITE_INFO.responseTime.text}にご返信いたします。
                  お急ぎの場合はお電話にてお問い合わせください。
                </p>
              </div>

              {/* Contact Info */}
              <div className='space-y-6'>
                <h3 className='text-sm font-medium uppercase tracking-widest text-muted-foreground'>
                  その他のお問い合わせ方法
                </h3>

                <div>
                  <p className='text-sm text-muted-foreground'>Email</p>
                  <a
                    href={`mailto:${SITE_INFO.contact.email}`}
                    className='text-lg transition-colors hover:text-muted-foreground'
                  >
                    {SITE_INFO.contact.email}
                  </a>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>営業時間</p>
                  <p className='mt-1'>{SITE_INFO.businessHours.display}</p>
                  <p className='text-xs text-muted-foreground'>
                    土日祝日はお休みをいただいております
                  </p>
                </div>
              </div>

              {/* FAQ Link */}
              <div className='border-t border-border pt-6'>
                <p className='text-sm text-muted-foreground'>
                  よくあるご質問は
                  <a
                    href='/faq'
                    className='ml-1 underline underline-offset-4 transition-colors hover:text-foreground'
                  >
                    FAQページ
                  </a>
                  をご覧ください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
