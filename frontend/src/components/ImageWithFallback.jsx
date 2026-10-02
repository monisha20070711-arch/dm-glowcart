import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const DIVERSE_BEAUTY_FALLBACKS = [
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', // Lipstick
  'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?w=800', // Blush
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', // Foundation
  'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800', // Concealer
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', // Primer
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800', // Highlighter
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', // Eyeliner
  'https://images.unsplash.com/photo-1608248597263-00079e96447c?w=800', // Serum Bottle
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800', // Skincare Cream
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800', // Sheet Mask
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', // Ethnic Kurta
  'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800'  // Scrunchie
];

const getHashIndex = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % DIVERSE_BEAUTY_FALLBACKS.length;
};

const ImageWithFallback = ({ src, alt, className = '', fallbackSrc }) => {
  const initialHash = getHashIndex(alt || 'DM-GLOWCART');
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc || DIVERSE_BEAUTY_FALLBACKS[initialHash]);
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
    if (fallbackStep < DIVERSE_BEAUTY_FALLBACKS.length) {
      const nextIndex = (initialHash + fallbackStep + 1) % DIVERSE_BEAUTY_FALLBACKS.length;
      setCurrentSrc(DIVERSE_BEAUTY_FALLBACKS[nextIndex]);
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
