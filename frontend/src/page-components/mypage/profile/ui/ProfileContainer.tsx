'use client';

import { useEffect } from 'react';
import { useMypageContext } from '@/shared/contexts/MypageContext';
import { ProfileForm } from './components/ProfileForm';
import { PasswordForm } from './components/PasswordForm';

export function ProfilePage() {
  const { setPageMeta } = useMypageContext();

  useEffect(() => {
    setPageMeta({
      title: 'アカウント設定',
      description: 'プロフィールやパスワードを変更できます',
    });
  }, [setPageMeta]);

  return (
    <div className='space-y-8'>
      <ProfileForm />
      <PasswordForm />
    </div>
  );
}
