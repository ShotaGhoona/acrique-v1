import { SITE_INFO } from '@/shared/config/site-info';

export interface LawItem {
  label: string;
  value: string;
}

export const lawItems: LawItem[] = [
  { label: '販売業者', value: SITE_INFO.company.name },
  { label: '運営統括責任者', value: SITE_INFO.company.representative },
  {
    label: '所在地',
    value: SITE_INFO.address.full,
  },
  { label: '電話番号', value: SITE_INFO.contact.phoneDisplay },
  { label: 'メールアドレス', value: SITE_INFO.contact.email },
  { label: 'URL', value: SITE_INFO.website.url },
  {
    label: '商品の販売価格',
    value: '各商品ページに税込価格を表示しています。',
  },
  {
    label: '商品代金以外の必要料金',
    value: `送料：${SITE_INFO.shipping.feeDisplay}\n${SITE_INFO.shipping.freeThresholdNote}\n銀行振込の場合、振込手数料はお客様負担となります。`,
  },
  {
    label: 'お支払い方法',
    value:
      '• クレジットカード（VISA、Mastercard、American Express、JCB）\n• 銀行振込\n• 請求書払い（法人様向け・事前審査あり）',
  },
  {
    label: 'お支払い期限',
    value:
      'クレジットカード：ご注文時に決済\n銀行振込：ご注文日から7日以内\n請求書払い：月末締め翌月末払い',
  },
  {
    label: '商品の引き渡し時期',
    value:
      'データ確認完了後、5〜10営業日で発送いたします。\n※商品・数量により異なります。詳細は各商品ページをご確認ください。',
  },
  {
    label: '返品・交換について',
    value:
      'オーダーメイド商品のため、お客様都合による返品・交換はお受けできません。\n\n商品の不良・破損があった場合は、到着後7日以内にご連絡ください。\n確認の上、交換または返金にて対応いたします。',
  },
  {
    label: 'キャンセルについて',
    value:
      '製作開始前：キャンセル可能（全額返金）\n製作開始後：キャンセル不可\n\n製作開始のタイミングは、データ確認完了時となります。',
  },
  {
    label: '動作環境',
    value:
      '当サイトをご利用いただくには、以下のブラウザを推奨いたします。\n• Google Chrome（最新版）\n• Safari（最新版）\n• Firefox（最新版）\n• Microsoft Edge（最新版）',
  },
];
