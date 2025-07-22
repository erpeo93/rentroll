'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { improvementQuestions } from '@/lib/helpQuestions';

export default function HelpUsImprovePage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter();

  const currentQuestion = improvementQuestions[step];

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    if (step < improvementQuestions.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Submit to API
      fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      }).then(() => {
        router.push('/thank-you');
      });
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="bg-neutral-100 rounded-lg border border-black shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">{currentQuestion.text}</h2>
        <ul className="space-y-2">
          {currentQuestion.options.map((opt) => (
            <li key={opt}>
              <button
                onClick={() => handleAnswer(opt)}
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}