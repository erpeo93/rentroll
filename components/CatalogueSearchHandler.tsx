'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUIContext } from '@/lib/UIContext';

export default function CatalogueSearchHandler() {
  const searchParams = useSearchParams();
  const { setActiveType } = useUIContext();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'ENTERTAINMENT' || type === 'CONSUMABLE') {
      setActiveType(type);
    }
  }, [searchParams, setActiveType]);

  return null;
}