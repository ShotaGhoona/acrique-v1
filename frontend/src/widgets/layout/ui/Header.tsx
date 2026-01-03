'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ShoppingBag, Search, User, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/shared/ui/shadcn/ui/sheet';

// 商品カテゴリデータ (03-items.mdに基づく)
const menuData = {
  shop: {
    title: 'For Shop',
    tagline: '世界観を、置く。',
    description: '店舗・サロン向け',
    href: '/shop',
    items: [
      {
        name: 'QR Code Cube',
        nameJa: 'QRコード・キューブ',
        description: 'Instagram、決済用QR、Wi-Fi案内に',
        href: '/shop/qr-cube',
        image: '/placeholder/product-1.jpg',
      },
      {
        name: 'Logo Cutout Object',
        nameJa: 'ロゴ・カットアウト',
        description: 'レジ横、受付サイン、撮影用プロップに',
        href: '/shop/logo-cutout',
        image: '/placeholder/product-2.jpg',
      },
      {
        name: 'Luxury Price Tag',
        nameJa: 'プライスカード',
        description: 'ジュエリー、時計、高級商材のスペック表に',
        href: '/shop/price-tag',
        image: '/placeholder/product-3.jpg',
      },
    ],
  },
  office: {
    title: 'For Office',
    tagline: '信頼を、刻む。',
    description: 'オフィス・企業向け',
    href: '/office',
    items: [
      {
        name: 'Floating Wall Sign',
        nameJa: 'フローティング・ウォールサイン',
        description: 'エントランス社名看板、パーパスボードに',
        href: '/office/wall-sign',
        image: '/placeholder/product-4.jpg',
      },
      {
        name: 'Deal Tombstones',
        nameJa: '成約記念モニュメント',
        description: '上場記念、M&A成立記念、プロジェクト完了盾に',
        href: '/office/tombstones',
        image: '/placeholder/product-5.jpg',
      },
      {
        name: 'Desk Name Plate',
        nameJa: '役員用ネームプレート',
        description: '社長室、役員デスクに',
        href: '/office/name-plate',
        image: '/placeholder/product-6.jpg',
      },
    ],
  },
  you: {
    title: 'For You',
    tagline: '瞬間を、閉じ込める。',
    description: '個人・ギフト向け',
    href: '/you',
    items: [
      {
        name: 'Trading Card Display',
        nameJa: 'トレカ・アーキテクト',
        description: 'ポケカ、遊戯王などの高額カード展示に',
        href: '/you/card-display',
        image: '/placeholder/product-7.jpg',
      },
      {
        name: 'Wedding Welcome Board',
        nameJa: 'ウェディング・ボード',
        description: '結婚式ウェルカムスペース、新居のインテリアに',
        href: '/you/wedding-board',
        image: '/placeholder/product-8.jpg',
      },
      {
        name: 'Baby Hand/Foot Print',
        nameJa: '手形足形アート',
        description: '出産祝い、内祝いに',
        href: '/you/baby-print',
        image: '/placeholder/product-9.jpg',
      },
    ],
  },
};

const subNavItems = [
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

type MenuKey = 'shop' | 'office' | 'you';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto w-full max-w-7xl px-6 lg:px-12'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center'>
            <Image
              src='/SVG/logo.svg'
              alt='ACRIQUE'
              width={140}
              height={38}
              className='h-8 w-auto'
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden items-center gap-8 lg:flex'>
            {(Object.keys(menuData) as MenuKey[]).map((key) => {
              const menu = menuData[key];
              return (
                <div
                  key={key}
                  className='relative py-5'
                  onMouseEnter={() => setActiveMenu(key)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={menu.href}
                    className='group flex items-center gap-1 text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground'
                  >
                    {menu.title}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        activeMenu === key ? 'rotate-180' : ''
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className='hidden items-center gap-2 lg:flex'>
            {subNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='px-3 py-2 text-xs font-medium uppercase tracking-wider text-foreground/60 transition-colors hover:text-foreground'
              >
                {item.label}
              </Link>
            ))}
            <div className='ml-4 flex items-center gap-1'>
              <Button variant='ghost' size='icon' className='h-9 w-9'>
                <Search className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' className='h-9 w-9'>
                <User className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' className='relative h-9 w-9'>
                <ShoppingBag className='h-4 w-4' />
                <span className='absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] text-background'>
                  0
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className='flex items-center gap-2 lg:hidden'>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <ShoppingBag className='h-4 w-4' />
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='h-9 w-9'>
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                className='w-full overflow-y-auto sm:w-96'
              >
                <SheetTitle className='sr-only'>メニュー</SheetTitle>
                <div className='flex flex-col gap-6 pt-8'>
                  {/* Mobile Logo */}
                  <Image
                    src='/SVG/logo.svg'
                    alt='ACRIQUE'
                    width={120}
                    height={32}
                    className='h-7 w-auto'
                  />

                  {/* Mobile Main Nav with Categories */}
                  <nav className='flex flex-col gap-8'>
                    {(Object.keys(menuData) as MenuKey[]).map((key) => {
                      const menu = menuData[key];
                      return (
                        <div key={key} className='space-y-3'>
                          <Link
                            href={menu.href}
                            onClick={() => setIsOpen(false)}
                            className='block'
                          >
                            <span className='text-lg font-medium tracking-wide'>
                              {menu.title}
                            </span>
                            <span className='mt-0.5 block text-xs text-muted-foreground'>
                              {menu.tagline}
                            </span>
                          </Link>
                          <div className='ml-3 space-y-2 border-l border-border pl-3'>
                            {menu.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className='block text-sm text-muted-foreground transition-colors hover:text-foreground'
                              >
                                {item.nameJa}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </nav>

                  {/* Mobile Sub Nav */}
                  <div className='border-t pt-6'>
                    <nav className='flex flex-col gap-4'>
                      {subNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Mobile Actions */}
                  <div className='mt-auto flex flex-col gap-3 border-t pt-6'>
                    <Button
                      variant='outline'
                      className='w-full justify-start gap-3'
                    >
                      <Search className='h-4 w-4' />
                      検索
                    </Button>
                    <Button
                      variant='outline'
                      className='w-full justify-start gap-3'
                    >
                      <User className='h-4 w-4' />
                      ログイン
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <div
        className={`absolute left-0 right-0 border-b border-border bg-background shadow-lg transition-all duration-200 lg:block ${
          activeMenu
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        } hidden`}
        onMouseEnter={() => activeMenu && setActiveMenu(activeMenu)}
        onMouseLeave={() => setActiveMenu(null)}
      >
        {activeMenu && (
          <div className='max-w-8xl mx-auto w-full px-6 py-8 lg:px-12'>
            <div className='grid grid-cols-12 gap-8'>
              {/* Left: Category Info */}
              <div className='col-span-3 border-r border-border pr-8'>
                <Link href={menuData[activeMenu].href} className='group block'>
                  <h3 className='text-2xl font-light tracking-tight'>
                    {menuData[activeMenu].title}
                  </h3>
                  <p className='mt-2 text-sm italic text-accent'>
                    {menuData[activeMenu].tagline}
                  </p>
                  <p className='mt-4 text-sm text-muted-foreground'>
                    {menuData[activeMenu].description}
                  </p>
                  <span className='mt-4 inline-flex items-center text-xs font-medium uppercase tracking-wider text-foreground/60 transition-colors group-hover:text-foreground'>
                    すべて見る →
                  </span>
                </Link>
              </div>

              {/* Right: Products Grid */}
              <div className='col-span-9'>
                <div className='grid grid-cols-3 gap-6'>
                  {menuData[activeMenu].items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className='group block'
                    >
                      {/* Placeholder Image */}
                      <div className='aspect-[4/3] overflow-hidden rounded-sm bg-secondary/50'>
                        <div className='flex h-full w-full items-center justify-center text-muted-foreground/30'>
                          <div className='text-center'>
                            <div className='mx-auto h-12 w-12 rounded border-2 border-dashed border-current' />
                            <span className='mt-2 block text-xs'>Image</span>
                          </div>
                        </div>
                      </div>
                      <div className='mt-3'>
                        <h4 className='text-sm font-medium tracking-wide transition-colors group-hover:text-accent'>
                          {item.name}
                        </h4>
                        <p className='mt-0.5 text-xs text-muted-foreground'>
                          {item.nameJa}
                        </p>
                        <p className='mt-1 text-xs text-muted-foreground/70'>
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
