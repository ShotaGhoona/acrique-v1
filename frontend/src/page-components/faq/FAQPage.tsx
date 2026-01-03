'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/ui/shadcn/lib/utils';

const faqCategories = [
  {
    id: 'order',
    name: 'ご注文について',
    faqs: [
      {
        question: '注文後のキャンセルはできますか？',
        answer:
          '製作開始前であればキャンセル可能です。データ確認完了後、製作に入った商品についてはキャンセルを承ることができません。',
      },
      {
        question: '注文内容の変更はできますか？',
        answer:
          '製作開始前であれば変更可能です。マイページの「注文履歴」からお問い合わせいただくか、直接ご連絡ください。',
      },
      {
        question: '法人での注文は可能ですか？',
        answer:
          'はい、法人様のご注文も承っております。請求書払いをご希望の場合は、お問い合わせフォームよりご連絡ください。',
      },
      {
        question: '見積もりを依頼したいのですが？',
        answer:
          '大量注文やカスタムオーダーについては、「見積もり依頼」ページからご依頼いただけます。通常2〜3営業日以内にご回答いたします。',
      },
    ],
  },
  {
    id: 'payment',
    name: 'お支払いについて',
    faqs: [
      {
        question: '利用できる支払い方法は？',
        answer:
          'クレジットカード（VISA、Mastercard、American Express、JCB）および銀行振込がご利用いただけます。',
      },
      {
        question: '請求書払いは可能ですか？',
        answer:
          '法人様向けに請求書払い（月末締め翌月末払い）をご用意しております。事前審査が必要となりますので、お問い合わせください。',
      },
      {
        question: '領収書は発行できますか？',
        answer:
          'はい、マイページの注文詳細から領収書をダウンロードいただけます。宛名の変更が必要な場合はお問い合わせください。',
      },
    ],
  },
  {
    id: 'upload',
    name: 'データ入稿について',
    faqs: [
      {
        question: '入稿データの形式は何に対応していますか？',
        answer:
          'AI（Adobe Illustrator）、PDF、PNG、JPG形式に対応しています。ベクターデータ（AI/PDF）をご入稿いただくと、より鮮明な仕上がりになります。',
      },
      {
        question: 'データ作成を依頼できますか？',
        answer:
          '基本的にはお客様にてデータをご用意いただいておりますが、簡単なロゴのトレースなどは別途料金にて承ります。お問い合わせください。',
      },
      {
        question: 'データに問題があった場合はどうなりますか？',
        answer:
          '入稿データに問題があった場合は、メールにてご連絡いたします。修正データをお送りいただくまで製作は保留となります。',
      },
      {
        question: 'QRコードはどうやって入稿すればいいですか？',
        answer:
          'QRコード生成サービスで作成したPNGまたはSVGデータをアップロードしてください。読み取りテストを弊社でも行います。',
      },
    ],
  },
  {
    id: 'delivery',
    name: '配送について',
    faqs: [
      {
        question: '送料はいくらですか？',
        answer: '全国一律1,000円（税込）です。30,000円以上のご注文で送料無料となります。',
      },
      {
        question: '納期はどのくらいですか？',
        answer:
          '商品により異なりますが、データ確認完了後、通常5〜10営業日でのお届けとなります。各商品ページに目安の納期を記載しています。',
      },
      {
        question: '配送日時の指定はできますか？',
        answer:
          '発送後、ヤマト運輸または佐川急便のWebサービスから配送日時の変更が可能です。発送時に追跡番号をお知らせします。',
      },
      {
        question: '海外への発送は可能ですか？',
        answer:
          '申し訳ございませんが、現在は日本国内のみの配送となっております。海外発送をご希望の場合はご相談ください。',
      },
    ],
  },
  {
    id: 'product',
    name: '商品について',
    faqs: [
      {
        question: '素材は何を使用していますか？',
        answer:
          '高透明度のアクリル樹脂を使用しています。一般的なアクリルより透明度が高く、黄変しにくい素材を厳選しています。',
      },
      {
        question: 'サイズのカスタマイズはできますか？',
        answer:
          '規格サイズ以外をご希望の場合は、見積もり依頼からご相談ください。製作可能かどうか確認の上、お見積りいたします。',
      },
      {
        question: '屋外で使用できますか？',
        answer:
          '基本的に屋内使用を想定しています。直射日光や雨風にさらされる環境では、変色や劣化の原因となる場合があります。',
      },
      {
        question: 'お手入れ方法を教えてください',
        answer:
          '柔らかい布で乾拭きしてください。汚れがひどい場合は、中性洗剤を薄めた水で拭き取り、すぐに乾いた布で水分を拭き取ってください。',
      },
    ],
  },
  {
    id: 'return',
    name: '返品・交換について',
    faqs: [
      {
        question: '返品・交換はできますか？',
        answer:
          'オーダーメイド製品のため、お客様都合での返品・交換は承っておりません。商品に不良がある場合は到着後7日以内にご連絡ください。',
      },
      {
        question: '届いた商品が破損していた場合は？',
        answer:
          '配送中の破損については、到着後7日以内にご連絡いただければ、無償で交換または返金対応いたします。破損状態の写真をお送りください。',
      },
      {
        question: 'イメージと違った場合は？',
        answer:
          '入稿データ通りに製作しているため、イメージ違いでの返品は承っておりません。ご不明点があれば、ご注文前にお問い合わせください。',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-8 font-medium">{question}</span>
        <ChevronDown
          className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', {
            'rotate-180': isOpen,
          })}
        />
      </button>
      <div
        className={cn('grid transition-all duration-300', {
          'grid-rows-[1fr]': isOpen,
          'grid-rows-[0fr]': !isOpen,
        })}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('order');

  return (
    <main>
      {/* Hero */}
      <section className="bg-secondary/30 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            FAQ
          </p>
          <h1 className="mt-6 text-4xl font-light md:text-5xl">よくあるご質問</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            お客様からよくいただくご質問をまとめました。
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-4 lg:gap-16">
            {/* Category Navigation */}
            <nav className="lg:col-span-1">
              <div className="sticky top-32 space-y-1">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'block w-full rounded-sm px-4 py-3 text-left text-sm transition-colors',
                      {
                        'bg-foreground text-background': activeCategory === category.id,
                        'hover:bg-secondary/50': activeCategory !== category.id,
                      }
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </nav>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              {faqCategories.map((category) => (
                <div
                  key={category.id}
                  className={cn({ hidden: activeCategory !== category.id })}
                >
                  <h2 className="mb-8 text-2xl font-light">{category.name}</h2>
                  <div>
                    {category.faqs.map((faq, index) => (
                      <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-secondary/30 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-12">
          <h2 className="text-2xl font-light md:text-3xl">お探しの回答が見つからない場合</h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            お気軽にお問い合わせください。営業日2日以内にご返答いたします。
          </p>
          <a
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            お問い合わせ
          </a>
        </div>
      </section>
    </main>
  );
}
