import type { Metadata } from 'next';
import { AboutPage } from '@/page-components/about/AboutPage';

export const metadata: Metadata = {
  title: 'About | ACRIQUE',
  description:
    '透明を、結晶化する。ACRIQUEは、アクリルという素材を「光のオブジェ」へと昇華させる、工場直結のブランドです。',
  openGraph: {
    title: 'About ACRIQUE - 透明を、結晶化する。',
    description:
      'ACRIQUEは、アクリルという素材を「光のオブジェ」へと昇華させる、工場直結のブランドです。',
  },
};

export default function AboutPageRoute() {
  return <AboutPage />;
}
