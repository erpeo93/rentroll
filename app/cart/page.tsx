'use client';

import React, { Suspense } from 'react';
import CartContent from './CartContent';

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading cart...</div>}>
      <CartContent />
    </Suspense>
  );
}