'use client';

import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-2xl font-bold mb-4">🎉 Thank you!</h1>
      <p className="mb-6 text-gray-700">
        Your feedback helps us improve our service. We’ll do our best to reach your city soon!
      </p>
      <button
        onClick={() => router.push('/')}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Homepage
      </button>
    </div>
  );
}