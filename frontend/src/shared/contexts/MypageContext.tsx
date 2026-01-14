'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface PageMeta {
  title: string;
  description?: string;
}

interface MypageContextValue {
  pageMeta: PageMeta;
  setPageMeta: (meta: PageMeta) => void;
}

const MypageContext = createContext<MypageContextValue | null>(null);

export function MypageProvider({ children }: { children: React.ReactNode }) {
  const [pageMeta, setPageMetaState] = useState<PageMeta>({
    title: 'マイページ',
    description: '',
  });

  const setPageMeta = useCallback((meta: PageMeta) => {
    setPageMetaState(meta);
  }, []);

  return (
    <MypageContext.Provider value={{ pageMeta, setPageMeta }}>
      {children}
    </MypageContext.Provider>
  );
}

export function useMypageContext() {
  const context = useContext(MypageContext);
  if (!context) {
    throw new Error('useMypageContext must be used within a MypageProvider');
  }
  return context;
}
