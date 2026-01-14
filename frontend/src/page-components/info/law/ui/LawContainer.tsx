'use client';

import { lawItems } from '../config/law-data';

export function LawPage() {
  return (
    <main>
      {/* Hero */}
      <section className='bg-secondary/30 py-24 md:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Legal Notice
          </p>
          <h1 className='mt-6 text-4xl font-light md:text-5xl'>
            特定商取引法に基づく表記
          </h1>
          <p className='mt-6 max-w-2xl text-lg text-muted-foreground'>
            特定商取引法第11条に基づく表示
          </p>
        </div>
      </section>

      {/* Content */}
      <section className='py-24 md:py-32'>
        <div className='mx-auto max-w-3xl px-6 lg:px-12'>
          <div className='overflow-hidden rounded-sm border border-border'>
            <table className='w-full'>
              <tbody>
                {lawItems.map((item, index) => (
                  <tr
                    key={index}
                    className={index !== 0 ? 'border-t border-border' : ''}
                  >
                    <th className='w-1/3 bg-secondary/30 p-4 text-left align-top text-sm font-medium'>
                      {item.label}
                    </th>
                    <td className='whitespace-pre-wrap p-4 text-sm leading-relaxed text-muted-foreground'>
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-16 border-t border-border pt-8'>
            <p className='text-sm text-muted-foreground'>
              最終更新日: 2024年6月1日
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
