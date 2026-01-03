import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Mail } from 'lucide-react';
import { getAllCategories } from '@/shared/domain/category/data/categories';

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const supportLinks = [
  { label: 'ご利用ガイド', href: '/guide' },
  { label: 'よくある質問', href: '/faq' },
  { label: '利用規約', href: '/terms' },
  { label: '特定商取引法に基づく表記', href: '/law' },
  { label: 'プライバシーポリシー', href: '/privacy' },
];

export function Footer() {
  const categories = getAllCategories();

  return (
    <footer className="border-t border-border bg-background">
      {/* Main Footer */}
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src="/SVG/logo.svg"
                alt="ACRIQUE"
                width={160}
                height={44}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              極上のアクリルを、1個から。
              <br />
              1cmの厚み、A2サイズ対応、精密なレーザーカット技術で、
              あなただけのプロダクトをお届けします。
            </p>
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@acrique.jp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-foreground">
              Products
            </h3>
            <ul className="mt-4 space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={category.href}
                    className="group block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {category.name}
                    <span className="ml-2 text-xs text-muted-foreground/60">
                      {category.nameJa}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-medium uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} ACRIQUE. All rights reserved.
            </p>
            <p>Made with precision in Japan.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
