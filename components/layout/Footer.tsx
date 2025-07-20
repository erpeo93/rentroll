'use client';

import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="w-full mt-12 py-8 border-t border-neutral-200 bg-neutral-50 text-center">
      <p className="mb-3 text-neutral-700">Any question or feedback?</p>
      <button
        onClick={() => router.push('/help-us-improve')}
        className="text-indigo-600 hover:text-indigo-800 font-semibold"
      >
        Help Us Improve
      </button>
    </footer>
  );
}