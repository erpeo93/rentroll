'use client';

import { useTranslation } from '../lib/i18n';
import { useRouter } from 'next/navigation';

export default function CatalogueBanner() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <section className="my-10 px-4 sm:px-6 md:px-8">
      <div
        className="relative w-full max-w-[100vw] mx-auto h-100 sm:h-100 md:h-[30rem] lg:h-[30rem] rounded-2xl overflow-hidden shadow-lg"
        style={{
          backgroundImage: "url('/banner.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            {t('catalogue_banner_title') || 'Explore Our Full Catalogue'}
          </h2>
          <button
            onClick={() => router.push('/catalogue')}
            className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition"
          >
            {t('button_start') || 'Discover all products'}
          </button>
        </div>
      </div>
    </section>
  );
}