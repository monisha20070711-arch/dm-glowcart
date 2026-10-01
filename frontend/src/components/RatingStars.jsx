import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 4.5, count, size = 'sm', showNumeric = true }) => {
  const stars = [];
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Star key={i} className={`${starSize} fill-amber-400 text-amber-400`} />);
    } else if (i - 0.5 <= rating) {
      stars.push(
        <div key={i} className="relative">
          <Star className={`${starSize} text-slate-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${starSize} fill-amber-400 text-amber-400`} />
          </div>
        </div>
      );
    } else {
      stars.push(<Star key={i} className={`${starSize} text-slate-200`} />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">{stars}</div>
      {showNumeric && (
        <span className="text-xs font-semibold text-slate-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-slate-400 font-normal">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
