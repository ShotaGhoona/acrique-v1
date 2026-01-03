'use client';

import { Package, Upload, CreditCard, Truck, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Package,
    title: '商品を選ぶ',
    description:
      'カテゴリーから用途に合った商品をお選びください。サイズやオプションを選択し、カートに追加します。',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'ご注文・お支払い',
    description:
      'カート内容を確認後、お届け先情報とお支払い方法を入力します。クレジットカードまたは銀行振込がご利用いただけます。',
  },
  {
    number: '03',
    icon: Upload,
    title: 'データ入稿',
    description:
      'ロゴやQRコードなど、製作に必要なデータをアップロードしてください。対応形式はAI、PDF、PNG、JPGです。',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'データ確認',
    description:
      '弊社スタッフがデータを確認し、製作可能な状態かをチェックします。問題があればご連絡いたします。',
  },
  {
    number: '05',
    icon: Truck,
    title: '製作・発送',
    description:
      'データ確認後、製作に入ります。完成次第、追跡番号をお知らせし、丁寧に梱包してお届けします。',
  },
];

const faqs = [
  {
    question: '入稿データの形式は何に対応していますか？',
    answer:
      'AI（Adobe Illustrator）、PDF、PNG、JPG形式に対応しています。ベクターデータ（AI/PDF）の場合、より鮮明な仕上がりになります。',
  },
  {
    question: '納期はどのくらいですか？',
    answer:
      '商品によって異なりますが、データ確認完了後、通常5〜10営業日でお届けします。お急ぎの場合はお問い合わせください。',
  },
  {
    question: '大量注文の場合、割引はありますか？',
    answer:
      'はい、まとまった数量でのご注文は別途お見積りいたします。「見積もり依頼」からご相談ください。',
  },
  {
    question: '返品・交換はできますか？',
    answer:
      'オーダーメイド製品のため、お客様都合での返品・交換は承っておりません。不良品の場合は到着後7日以内にご連絡ください。',
  },
];

export function GuidePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-secondary/30 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Guide
          </p>
          <h1 className="mt-6 text-4xl font-light md:text-5xl">ご利用ガイド</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            ACRIQUEでのお買い物から商品到着までの流れをご案内します。
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Flow
            </p>
            <h2 className="mt-6 text-3xl font-light md:text-4xl">ご注文の流れ</h2>
          </div>

          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-5 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-full top-10 hidden h-px w-full bg-border md:block" />
                )}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50">
                  <step.icon className="h-8 w-8 text-foreground/70" />
                </div>
                <div className="mt-6">
                  <span className="text-xs font-medium text-accent">STEP {step.number}</span>
                  <h3 className="mt-2 text-lg font-medium">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Upload Guide */}
      <section className="bg-secondary/30 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Data Upload
              </p>
              <h2 className="mt-6 text-3xl font-light md:text-4xl">データ入稿について</h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                製品の品質を最大限に引き出すため、適切なデータ形式でのご入稿をお願いしています。
              </p>
            </div>

            <div className="space-y-8">
              <div className="rounded-sm border border-border bg-background p-6">
                <h3 className="font-medium">推奨データ形式</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• AI（Adobe Illustrator）- ベクターデータ推奨</li>
                  <li>• PDF（アウトライン化済み）</li>
                  <li>• PNG（350dpi以上、透過対応）</li>
                  <li>• JPG（350dpi以上）</li>
                </ul>
              </div>

              <div className="rounded-sm border border-border bg-background p-6">
                <h3 className="font-medium">入稿時の注意点</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• テキストはアウトライン化してください</li>
                  <li>• カラーモードはCMYKを推奨</li>
                  <li>• 仕上がりサイズに合わせたデータをご用意ください</li>
                  <li>• ファイルサイズは50MBまで</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              FAQ
            </p>
            <h2 className="mt-6 text-3xl font-light md:text-4xl">よくあるご質問</h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-6">
                <h3 className="font-medium">{faq.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
