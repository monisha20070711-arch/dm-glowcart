import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const ImageWithFallback = ({ src, alt, className = '', fallbackSrc }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultFallback = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800';

  return (
    <div className={`relative overflow-hidden bg-rose-50/50 ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-glow-400 animate-spin" />
        </div>
      )}

      {!error ? (
        <img
          src={src || fallbackSrc || defaultFallback}
          alt={alt || 'DM-GLOWCART Product'}
          className={`${className} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-rose-100/60 text-glow-800 text-center">
          <Sparkles className="w-8 h-8 text-glow-600 mb-1" />
          <span className="text-xs font-semibold uppercase tracking-wider">DM-GLOWCART</span>
          <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{alt}</span>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
