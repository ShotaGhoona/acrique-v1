import { Gem, Hexagon, Box, type LucideIcon } from 'lucide-react';

export interface PhilosophyItem {
  icon: LucideIcon;
  title: string;
  titleJa: string;
  description: string;
}

export const philosophyItems: PhilosophyItem[] = [
  {
    icon: Gem,
    title: 'Pure Transparency',
    titleJa: '純粋な透明',
    description:
      '最高ランクのアクリルのみを使用。不純物のないクリアな輝きは、置かれた場所の光を取り込み、空間の一部となります。',
  },
  {
    icon: Hexagon,
    title: 'Sharp Edge',
    titleJa: '鋭利な輪郭',
    description:
      'あえて角を丸める処理を行いません。切り出されたままの鋭く平滑な断面こそが、光を最も美しく屈折させるプリズムとなるからです。',
  },
  {
    icon: Box,
    title: 'Solid Form',
    titleJa: '揺るぎない存在感',
    description:
      '薄いプレートではなく、自立する「塊」としての造形美を追求。台座などのノイズを排除し、そのモノ自体が持つ力強さを大切にしています。',
  },
];
