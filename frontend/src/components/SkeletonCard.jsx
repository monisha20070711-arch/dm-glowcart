import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm animate-pulse flex flex-col justify-between h-96">
      <div className="bg-slate-200 rounded-xl h-52 w-full mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        <div className="h-8 bg-slate-200 rounded-xl w-20"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
