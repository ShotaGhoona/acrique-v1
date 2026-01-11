import Image from 'next/image';

export function ContactHeroSection() {
  return (
    <section className='relative bg-foreground py-32 text-background'>
      <Image
        src='/IMG/contact-page/25-contact-hero-background.png'
        alt=''
        fill
        className='object-cover'
        priority
      />
      <div className='absolute inset-0 bg-foreground/60' />
      <div className='relative mx-auto max-w-7xl px-6 lg:px-12'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-background/50'>
            Contact
          </p>
          <h1 className='mt-6 text-4xl font-light md:text-5xl'>お問い合わせ</h1>
          <p className='mt-6 text-lg text-background/70'>
            商品に関するご質問、大量注文のご相談、
            <br className='hidden sm:block' />
            その他お気軽にお問い合わせください。
          </p>
        </div>
      </div>
    </section>
  );
}
