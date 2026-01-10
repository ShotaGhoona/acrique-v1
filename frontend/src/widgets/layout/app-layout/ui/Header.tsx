'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/shared/ui/shadcn/ui/sheet';
import {
  categories,
  getCategoryIds,
} from '@/shared/domain/category/data/categories';
import type { CategoryId } from '@/shared/domain/category/model/types';
import { useProducts } from '@/features/product/get-products/lib/use-products';
import { CartBadge } from './components/CartBadge';

const subNavItems = [
  { label: 'About', href: '/about' },
  { label: 'Guide', href: '/guide' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<CategoryId | null>(null);
  const [displayMenu, setDisplayMenu] = useState<CategoryId | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categoryIds = getCategoryIds();
  const { data: productsData } = useProducts();

  // メガメニュー用の商品を取得（各カテゴリ上位3件）
  const getMenuProducts = (categoryId: CategoryId) => {
    const allProducts = productsData?.products ?? [];
    return allProducts.filter((p) => p.category_id === categoryId).slice(0, 3);
  };

  // メガメニューを開く（遅延クローズをキャンセル）
  const handleMenuOpen = useCallback((categoryId: CategoryId) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    setActiveMenu(categoryId);
    setDisplayMenu(categoryId);
  }, []);

  // メガメニューを閉じる（遅延付き）
  const handleMenuClose = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      // アニメーション完了後にコンテンツを削除（duration-200 = 200ms）
      animationTimeoutRef.current = setTimeout(() => {
        setDisplayMenu(null);
      }, 200);
    }, 150);
  }, []);

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
            {categoryIds.map((categoryId) => {
              const category = categories[categoryId];
              return (
                <div
                  key={categoryId}
                  className='relative py-5'
                  onMouseEnter={() => handleMenuOpen(categoryId)}
                  onMouseLeave={handleMenuClose}
                >
                  <Link
                    href={category.href}
                    className='group flex items-center gap-1 text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground'
                  >
                    {category.name}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        activeMenu === categoryId ? 'rotate-180' : ''
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
              <Link href='/login'>
                <Button variant='ghost' size='icon' className='h-9 w-9'>
                  <User className='h-4 w-4' />
                </Button>
              </Link>
              <CartBadge />
            </div>
          </div>

          {/* Mobile Menu */}
          <div className='flex items-center gap-2 lg:hidden'>
            <CartBadge />
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
                    {categoryIds.map((categoryId) => {
                      const category = categories[categoryId];
                      const menuProducts = getMenuProducts(categoryId);
                      return (
                        <div key={categoryId} className='space-y-3'>
                          <Link
                            href={category.href}
                            onClick={() => setIsOpen(false)}
                            className='block'
                          >
                            <span className='text-lg font-medium tracking-wide'>
                              {category.name}
                            </span>
                            <span className='mt-0.5 block text-xs text-muted-foreground'>
                              {category.tagline}
                            </span>
                          </Link>
                          <div className='ml-3 space-y-2 border-l border-border pl-3'>
                            {menuProducts.map((product) => (
                              <Link
                                key={product.id}
                                href={`/${categoryId}/${product.id}`}
                                onClick={() => setIsOpen(false)}
                                className='block text-sm text-muted-foreground transition-colors hover:text-foreground'
                              >
                                {product.name_ja}
                              </Link>
                            ))}
                            <Link
                              href={category.href}
                              onClick={() => setIsOpen(false)}
                              className='block text-xs text-accent transition-colors hover:text-accent/80'
                            >
                              すべて見る →
                            </Link>
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
                    <Link href='/login' onClick={() => setIsOpen(false)}>
                      <Button
                        variant='outline'
                        className='w-full justify-start gap-3'
                      >
                        <User className='h-4 w-4' />
                        ログイン
                      </Button>
                    </Link>
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
        onMouseEnter={() => displayMenu && handleMenuOpen(displayMenu)}
        onMouseLeave={handleMenuClose}
      >
        {displayMenu && (
          <div className='mx-auto w-full max-w-7xl px-6 py-8 lg:px-12'>
            <div className='grid grid-cols-12 gap-8'>
              {/* Left: Category Info */}
              <div className='col-span-3 flex flex-col justify-between border-r border-border pr-8'>
                <div>
                  <h3 className='text-2xl font-light tracking-tight'>
                    {categories[displayMenu].name}
                  </h3>
                  <p className='mt-2 border-l-2 border-accent pl-3 text-sm italic text-accent'>
                    {categories[displayMenu].tagline}
                  </p>
                  <p className='mt-4 text-sm text-muted-foreground'>
                    {categories[displayMenu].description}
                  </p>
                </div>
                <Link
                  href={categories[displayMenu].href}
                  className='group mt-6 inline-flex w-full items-center justify-center gap-2 bg-foreground px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-background transition-colors hover:bg-foreground/90'
                >
                  すべて見る
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </Link>
              </div>

              {/* Right: Products Grid */}
              <div className='col-span-9'>
                <div className='grid grid-cols-3 gap-6'>
                  {getMenuProducts(displayMenu).map((product) => (
                    <Link
                      key={product.id}
                      href={`/${displayMenu}/${product.id}`}
                      className='group block'
                    >
                      <div className='aspect-[4/3] overflow-hidden rounded-sm bg-secondary/50'>
                        {product.main_image_url ? (
                          <Image
                            src={product.main_image_url}
                            alt={product.name_ja}
                            width={320}
                            height={240}
                            className='h-full w-full object-cover transition-transform group-hover:scale-105'
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center text-muted-foreground/30'>
                            <div className='text-center'>
                              <div className='mx-auto h-12 w-12 rounded border-2 border-dashed border-current' />
                              <span className='mt-2 block text-xs'>No Image</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className='mt-3'>
                        <h4 className='text-sm font-medium tracking-wide transition-colors group-hover:text-accent'>
                          {product.name}
                        </h4>
                        <p className='mt-0.5 text-xs text-muted-foreground'>
                          {product.name_ja}
                        </p>
                        <p className='mt-1 line-clamp-2 text-xs text-muted-foreground/70'>
                          {product.tagline}
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
