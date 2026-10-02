import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const BEAUTY_FALLBACKS = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
  'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'
];

const ImageWithFallback = ({ src, alt, className = '', fallbackSrc }) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc || BEAUTY_FALLBACKS[0]);
  const [fallbackStep, setFallbackStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failedAll, setFailedAll] = useState(false);

  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setFailedAll(false);
      setFallbackStep(0);
    }
  }, [src]);

  const handleError = () => {
    if (fallbackStep < BEAUTY_FALLBACKS.length) {
      setCurrentSrc(BEAUTY_FALLBACKS[fallbackStep]);
      setFallbackStep((prev) => prev + 1);
    } else {
      setFailedAll(true);
      setLoading(false);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-rose-50/50 ${className}`}>
      {loading && !failedAll && (
        <div className="absolute inset-0 bg-rose-100/30 animate-pulse flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-glow-400 animate-spin" />
        </div>
      )}

      {!failedAll ? (
        <img
          src={currentSrc}
          alt={alt || 'DM-GLOWCART Product'}
          className={`${className} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={handleError}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-100 to-rose-200 text-glow-800 text-center">
          <Sparkles className="w-7 h-7 text-glow-600 mb-1" />
          <span className="text-[11px] font-serif font-bold tracking-wider text-glow-800 uppercase">DM-GLOWCART</span>
          <span className="text-[10px] text-slate-600 font-medium line-clamp-1 mt-0.5">{alt}</span>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
