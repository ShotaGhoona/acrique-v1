import { Cpu, Sparkles, Scale, type LucideIcon } from 'lucide-react';

export interface CraftItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const craftItems: CraftItem[] = [
  {
    icon: Cpu,
    title: 'Laser Precision',
    description:
      '0.1mm単位のレーザー出力を調整し、断面を鏡のように仕上げる。精密加工で培った職人の技術です。',
  },
  {
    icon: Sparkles,
    title: 'Light Design',
    description:
      '文字やロゴが空間に浮かび上がる瞬間を計算する。光と影を操るデザイン力で、イメージを形にします。',
  },
  {
    icon: Scale,
    title: 'Quality Control',
    description:
      '一つひとつを目視と計測で検品。量産体制の中でも、妥協のない品質管理を徹底しています。',
  },
];
