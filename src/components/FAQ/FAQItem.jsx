'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <Minus className="w-4 h-4 text-blue-500" />
        ) : (
          <Plus className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 animate-slideDown">
          {answer}
        </div>
      )}
    </div>
  );
}