'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useUIContext } from '@/lib/UIContext';

export default function HomeSearchHandler({
  catalogRef,
}: {
  catalogRef: React.RefObject<HTMLDivElement | null>;
}) {
  const searchParams = useSearchParams();
  const { setActiveType } = useUIContext();

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo === 'entertainment' || scrollTo === 'consumable') {
      setActiveType(scrollTo.toUpperCase() as 'ENTERTAINMENT' | 'CONSUMABLE');
      setTimeout(() => {
        catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams, setActiveType, catalogRef]);

  return null;
}