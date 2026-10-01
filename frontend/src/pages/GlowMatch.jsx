import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const GlowMatch = () => {
  const [step, setStep] = useState(1);
  const [skinConcern, setSkinConcern] = useState('Dryness');
  const [category, setCategory] = useState('Beauty & Personal Care');
  const [maxPrice, setMaxPrice] = useState('1000');
  const [skinType, setSkinType] = useState('All');

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSearchMatch = async () => {
    try {
      setLoading(true);
      setSubmitted(true);
      const res = await API.post('/recommendations/glow-match', {
        skinConcern,
        category,
        maxPrice,
        skinType
      });

      if (res.data.success) {
        setRecommendations(res.data.data);
      }
    } catch (err) {
      console.error('Glow match error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSubmitted(false);
    setRecommendations([]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-glow-700 text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-glow-600" />
          <span>DM-GLOWCART AI Beauty Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Smart Glow Match Tool
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Answer 4 quick skin & beauty preference questions to get tailored product matches computed specifically for your skin needs.
        </p>
      </div>

      {!submitted ? (
        <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-10 shadow-xl max-w-2xl mx-auto space-y-8">
          {/* Step Indicators */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold text-slate-400">
            <span className={step >= 1 ? 'text-glow-600' : ''}>1. Skin Concern</span>
            <span className={step >= 2 ? 'text-glow-600' : ''}>2. Category</span>
            <span className={step >= 3 ? 'text-glow-600' : ''}>3. Skin Type</span>
            <span className={step >= 4 ? 'text-glow-600' : ''}>4. Budget</span>
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-bold text-base text-slate-900">What is your primary skin concern?</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Dryness', 'Acne', 'Dullness', 'Pigmentation', 'Open Pores', 'Fine Lines'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSkinConcern(item)}
                    className={`p-4 rounded-2xl border text-xs font-bold text-left transition-all ${
                      skinConcern === item
                        ? 'border-glow-600 bg-rose-50/70 text-glow-700 shadow'
                        : 'border-slate-200 text-slate-700 hover:border-rose-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full mt-4 bg-glow-600 text-white font-bold text-xs py-3 rounded-xl shadow-glow flex items-center justify-center gap-2"
              >
                <span>Next Step</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-bold text-base text-slate-900">Which product category are you shopping for?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Beauty & Personal Care', 'Fashion', 'Accessories', 'Home & Lifestyle'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`p-4 rounded-2xl border text-xs font-bold text-left transition-all ${
                      category === item
                        ? 'border-glow-600 bg-rose-50/70 text-glow-700 shadow'
                        : 'border-slate-200 text-slate-700 hover:border-rose-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-3 rounded-xl">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-glow-600 text-white text-xs font-bold py-3 rounded-xl shadow-glow flex items-center justify-center gap-2">Next <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-bold text-base text-slate-900">What is your skin type?</h3>
              <div className="grid grid-cols-2 gap-3">
                {['All', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSkinType(item)}
                    className={`p-4 rounded-2xl border text-xs font-bold text-left transition-all ${
                      skinType === item
                        ? 'border-glow-600 bg-rose-50/70 text-glow-700 shadow'
                        : 'border-slate-200 text-slate-700 hover:border-rose-200'
                    }`}
                  >
                    {item} Skin
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)} className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-3 rounded-xl">Back</button>
                <button onClick={() => setStep(4)} className="flex-1 bg-glow-600 text-white text-xs font-bold py-3 rounded-xl shadow-glow flex items-center justify-center gap-2">Next <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-bold text-base text-slate-900">Select maximum budget limit (₹):</h3>
              <div className="grid grid-cols-3 gap-3">
                {['500', '1000', '1500'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMaxPrice(item)}
                    className={`p-4 rounded-2xl border text-xs font-bold text-center transition-all ${
                      maxPrice === item
                        ? 'border-glow-600 bg-rose-50/70 text-glow-700 shadow'
                        : 'border-slate-200 text-slate-700 hover:border-rose-200'
                    }`}
                  >
                    Under ₹{item}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(3)} className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-3.5 rounded-xl">Back</button>
                <button
                  onClick={handleSearchMatch}
                  className="flex-1 bg-gradient-to-r from-glow-600 to-rose-600 text-white text-xs font-bold py-3.5 rounded-xl shadow-glow flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> <span>Find Matches</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-rose-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Matches For Your Skin</h3>
              <p className="text-xs text-slate-500">Based on: {skinConcern} • {category} • Under ₹{maxPrice}</p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-glow-600 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Survey
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-glow-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                    {item.matchPercentage}% GLOW MATCH
                  </div>
                  <ProductCard product={item.product} />
                  <div className="bg-rose-50 p-3 rounded-b-2xl border-t border-rose-100 text-[11px] text-slate-600 font-medium mt-[-8px]">
                    💡 {item.matchReason}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlowMatch;
