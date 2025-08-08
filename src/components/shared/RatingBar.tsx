import { useState } from 'react';
import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';

interface RatingBarProps {
  rating: number;
  max?: number;
  onChange: (value: number) => void;
}

export default function RatingBar({ rating, max = 10, onChange }: RatingBarProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? rating;

  return (
    <div className="flex space-x-1" data-testid="rating-bar" onMouseLeave={() => setHovered(null)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((value) => (
        <button
          key={value}
          type="button"
          onMouseEnter={() => setHovered(value)}
          onFocus={() => setHovered(value)}
          onClick={() => onChange(value)}
          className="focus:outline-none transition-transform hover:scale-105"
          aria-label={`rate-${value}`}
        >
          {value <= display ? (
            <SolidStar className="h-6 w-6 text-amber-400" />
          ) : (
            <OutlineStar className="h-6 w-6 text-slate-300" />
          )}
        </button>
      ))}
    </div>
  );
}
