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
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">{currentQuestion.text}</h2>
      <div className="space-y-2">
        {currentQuestion.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}