import React from 'react';
import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';

interface RatingBarProps {
  rating: number;
  max?: number;
  onChange: (value: number) => void;
}

export default function RatingBar({ rating, max = 10, onChange }: RatingBarProps) {
  return (
    <div className="flex space-x-1" data-testid="rating-bar">
      {Array.from({ length: max }, (_, i) => i + 1).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className="focus:outline-none"
          aria-label={`rate-${value}`}
        >
          {value <= rating ? (
            <SolidStar className="h-6 w-6 text-yellow-500" />
          ) : (
            <OutlineStar className="h-6 w-6 text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
}
