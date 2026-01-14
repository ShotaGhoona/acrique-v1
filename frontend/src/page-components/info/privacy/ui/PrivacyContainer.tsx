'use client';

import { SITE_INFO } from '@/shared/config/site-info';

const sections = [
  {
    title: '1. 個人情報の定義',
    content: `本プライバシーポリシーにおいて「個人情報」とは、個人情報保護法に定める個人情報を指し、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、メールアドレス、その他の記述等により特定の個人を識別できるものを指します。`,
  },
  {
    title: '2. 個人情報の収集',
    content: `当社は、以下の場合に個人情報を収集することがあります。

• 会員登録時（氏名、メールアドレス、電話番号、住所等）
• 商品のご注文時（配送先情報、お支払い情報等）
• お問い合わせ時（氏名、メールアドレス、お問い合わせ内容等）

収集した個人情報は、適法かつ公正な手段により取得いたします。`,
  },
  {
    title: '3. 個人情報の利用目的',
    content: `当社は、収集した個人情報を以下の目的で利用いたします。

• 商品の発送およびサービスの提供
• ご注文内容の確認およびお問い合わせへの対応
• 新商品、キャンペーン等のご案内（同意いただいた方のみ）
• サービス改善のための統計データ作成
• 不正利用防止および安全確保
• 法令に基づく対応`,
  },
  {
    title: '4. 個人情報の第三者提供',
    content: `当社は、以下の場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。

• 法令に基づく場合
• 人の生命、身体または財産の保護のために必要がある場合
• 公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合
• 業務委託先（配送業者、決済代行会社等）への提供が必要な場合

業務委託先への提供に際しては、適切な監督を行います。`,
  },
  {
    title: '5. 個人情報の安全管理',
    content: `当社は、個人情報の漏洩、滅失、毀損の防止その他の安全管理のために、以下の措置を講じます。

• SSL/TLS暗号化による通信の保護
• アクセス権限の制限と管理
• 従業員への教育・研修の実施
• セキュリティ対策の定期的な見直し`,
  },
  {
    title: '6. Cookieの使用について',
    content: `当サイトでは、サービス向上のためCookieを使用しています。Cookieは、お客様のブラウザに保存される小さなテキストファイルです。

• サイトの利用状況の分析
• ログイン状態の維持
• カート情報の保存

ブラウザの設定によりCookieを無効にすることができますが、一部のサービスが正常に動作しなくなる場合があります。`,
  },
  {
    title: '7. 個人情報の開示・訂正・削除',
    content: `お客様は、当社が保有する自己の個人情報について、開示、訂正、削除を請求することができます。ご希望の場合は、本人確認の上、合理的な期間内に対応いたします。

ご請求は、お問い合わせフォームまたは下記連絡先までご連絡ください。`,
  },
  {
    title: '8. プライバシーポリシーの変更',
    content: `当社は、法令の変更やサービス内容の変更に伴い、本プライバシーポリシーを変更することがあります。重要な変更がある場合は、当サイト上でお知らせいたします。`,
  },
  {
    title: '9. お問い合わせ',
    content: `本プライバシーポリシーに関するお問い合わせは、下記までご連絡ください。

${SITE_INFO.company.name}
${SITE_INFO.address.short}
Email: ${SITE_INFO.contact.privacyEmail}`,
  },
];

export function PrivacyPage() {
  return (
    <main>
      {/* Hero */}
      <section className='bg-secondary/30 py-24 md:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Privacy Policy
          </p>
          <h1 className='mt-6 text-4xl font-light md:text-5xl'>
            プライバシーポリシー
          </h1>
          <p className='mt-6 max-w-2xl text-lg text-muted-foreground'>
            お客様の個人情報の取り扱いについて
          </p>
        </div>
      </section>

      {/* Content */}
      <section className='py-24 md:py-32'>
        <div className='mx-auto max-w-3xl px-6 lg:px-12'>
          <p className='mb-12 text-sm text-muted-foreground'>
            {SITE_INFO.company.name}
            （以下「当社」）は、お客様の個人情報を適切に取り扱うことが社会的責務であると考え、以下のとおりプライバシーポリシーを定めます。
          </p>

          <div className='space-y-12'>
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className='text-lg font-medium'>{section.title}</h2>
                <div className='mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          <div className='mt-16 border-t border-border pt-8'>
            <p className='text-sm text-muted-foreground'>
              制定日: 2024年1月1日
              <br />
              最終改定日: 2024年6月1日
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
