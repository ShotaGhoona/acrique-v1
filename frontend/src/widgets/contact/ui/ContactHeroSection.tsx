export function ContactHeroSection() {
  return (
    <section className='bg-foreground py-32 text-background'>
      <div className='mx-auto max-w-7xl px-6 lg:px-12'>
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
