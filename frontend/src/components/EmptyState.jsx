import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const EmptyState = ({
  icon: Icon = ShoppingBag,
  title = 'No items found',
  description = 'Looks like you have not added anything yet.',
  actionText = 'Start Shopping',
  actionLink = '/shop'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-rose-100/70 rounded-full flex items-center justify-center text-glow-600 mb-4 shadow-inner">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mt-1.5 mb-6">{description}</p>
      {actionText && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 bg-glow-600 hover:bg-glow-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-glow transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
