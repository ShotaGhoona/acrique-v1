import { MapPin, Clock, Mail, Building2 } from 'lucide-react';

const infoItems = [
  {
    icon: Building2,
    title: '運営会社',
    content: 'ACRIQUE',
    note: null,
  },
  {
    icon: MapPin,
    title: '所在地',
    content: '〒XXX-XXXX 東京都XX区XX町X-X-X',
    note: null,
  },
  {
    icon: Mail,
    title: 'メール',
    content: 'info@acrique.jp',
    note: '2営業日以内に返信いたします',
  },
  {
    icon: Clock,
    title: '営業時間',
    content: '平日 10:00 - 18:00',
    note: '土日祝日休業',
  },
];

export function ContactInfoSection() {
  return (
    <section className='bg-secondary/30 py-20'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {infoItems.map((item) => (
            <div key={item.title} className='flex gap-4'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background'>
                <item.icon className='h-4 w-4' />
              </div>
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  {item.title}
                </p>
                <p className='mt-1 font-medium'>{item.content}</p>
                {item.note && (
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
