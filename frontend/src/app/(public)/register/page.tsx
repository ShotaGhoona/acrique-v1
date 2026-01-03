'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useRegister } from '@/features/auth/register/lib/use-register';
import type { RegisterFormData } from '@/features/auth/register/model/types';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    name_kana: '',
    phone: '',
    company: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    registerMutation.mutate(formData);
  };

  return (
    <div className='flex min-h-screen items-center justify-center py-24'>
      <div className='w-full max-w-md px-6'>
        <div className='mb-12 text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Create Account
          </p>
          <h1 className='mt-4 text-3xl font-light'>会員登録</h1>
          <p className='mt-4 text-sm text-muted-foreground'>
            ACRIQUEをご利用いただくための会員登録
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-xs font-medium uppercase tracking-wide'
            >
              Email <span className='text-accent'>*</span>
            </Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='email@example.com'
              value={formData.email}
              onChange={handleChange}
              required
              className='h-12 rounded-sm border-border/50 bg-transparent placeholder:text-foreground/40 focus:border-foreground'
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='password'
              className='text-xs font-medium uppercase tracking-wide'
            >
              Password <span className='text-accent'>*</span>
            </Label>
            <div className='relative'>
              <Input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='8文字以上'
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className='h-12 rounded-sm border-border/50 bg-transparent pr-12 placeholder:text-foreground/40 focus:border-foreground'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='confirmPassword'
              className='text-xs font-medium uppercase tracking-wide'
            >
              Confirm Password <span className='text-accent'>*</span>
            </Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='パスワードを再入力'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className='h-12 rounded-sm border-border/50 bg-transparent pr-12 placeholder:text-foreground/40 focus:border-foreground'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          <div className='border-t border-border/30 pt-6'>
            <p className='mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground'>
              Optional Information
            </p>
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='name'
              className='text-xs font-medium uppercase tracking-wide'
            >
              Name
            </Label>
            <Input
              id='name'
              name='name'
              type='text'
              placeholder='山田 太郎'
              value={formData.name}
              onChange={handleChange}
              className='h-12 rounded-sm border-border/50 bg-transparent placeholder:text-foreground/40 focus:border-foreground'
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='name_kana'
              className='text-xs font-medium uppercase tracking-wide'
            >
              Name (Kana)
            </Label>
            <Input
              id='name_kana'
              name='name_kana'
              type='text'
              placeholder='ヤマダ タロウ'
              value={formData.name_kana}
              onChange={handleChange}
              className='h-12 rounded-sm border-border/50 bg-transparent placeholder:text-foreground/40 focus:border-foreground'
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='phone'
              className='text-xs font-medium uppercase tracking-wide'
            >
              Phone
            </Label>
            <Input
              id='phone'
              name='phone'
              type='tel'
              placeholder='03-1234-5678'
              value={formData.phone}
              onChange={handleChange}
              className='h-12 rounded-sm border-border/50 bg-transparent placeholder:text-foreground/40 focus:border-foreground'
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='company'
              className='text-xs font-medium uppercase tracking-wide'
            >
              Company
            </Label>
            <Input
              id='company'
              name='company'
              type='text'
              placeholder='株式会社〇〇'
              value={formData.company}
              onChange={handleChange}
              className='h-12 rounded-sm border-border/50 bg-transparent placeholder:text-foreground/40 focus:border-foreground'
            />
          </div>

          {(error || registerMutation.isError) && (
            <div className='border border-accent/30 bg-accent/5 p-4 text-sm text-foreground'>
              {error || '登録に失敗しました。入力内容をご確認ください。'}
            </div>
          )}

          <Button
            type='submit'
            size='lg'
            className='mt-8 w-full rounded-sm'
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? '登録中...' : '会員登録'}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </form>

        <div className='mt-12 text-center'>
          <p className='text-sm text-muted-foreground'>
            すでにアカウントをお持ちの方
          </p>
          <Link
            href='/login'
            className='mt-2 inline-block text-sm font-medium tracking-wide text-foreground transition-colors hover:text-accent'
          >
            ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
