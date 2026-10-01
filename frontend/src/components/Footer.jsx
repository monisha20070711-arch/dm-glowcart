import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, MapPin, Phone, ShieldCheck, Truck, RefreshCw, CreditCard, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing to DM-GLOWCART offers!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Brand Perks Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/40 text-glow-400 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Fast Free Delivery</h4>
            <p className="text-xs text-slate-400">On all orders above ₹499</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/40 text-glow-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">100% Genuine</h4>
            <p className="text-xs text-slate-400">Authentic beauty products</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/40 text-glow-400 flex items-center justify-center shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Easy 7-Day Returns</h4>
            <p className="text-xs text-slate-400">Hassle-free return policy</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/40 text-glow-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Razorpay Secure</h4>
            <p className="text-xs text-slate-400">UPI, Cards, Netbanking</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Info Column */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 group mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-glow-600 to-rose-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                DM-GLOWCART
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-glow-400 uppercase">
                Everyday Essentials, Made Better
              </span>
            </div>
          </Link>

          <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
            Your premier destination for high-performance cosmetics, skincare, fashion & everyday lifestyle essentials. Crafted with love for B.Sc. IT final year demonstration.
          </p>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-glow-400 shrink-0" />
              <span>Tiruppur, Tamil Nadu, India</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-glow-400 shrink-0" />
              <a href="mailto:monisha20070711@gmail.com" className="hover:text-white transition-colors">
                monisha20070711@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/shop?category=Beauty+%26+Personal+Care" className="hover:text-glow-400 transition-colors">Beauty & Personal Care</Link></li>
            <li><Link to="/shop?category=Fashion" className="hover:text-glow-400 transition-colors">Fashion Apparel</Link></li>
            <li><Link to="/shop?category=Accessories" className="hover:text-glow-400 transition-colors">Fashion Accessories</Link></li>
            <li><Link to="/shop?category=Home+%26+Lifestyle" className="hover:text-glow-400 transition-colors">Home & Lifestyle</Link></li>
            <li><Link to="/glow-match" className="text-glow-400 font-bold hover:underline">✨ Glow Match Finder</Link></li>
          </ul>
        </div>

        {/* Policies & Info */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/contact" className="hover:text-glow-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/about" className="hover:text-glow-400 transition-colors">About DM-GLOWCART</Link></li>
            <li><Link to="/orders" className="hover:text-glow-400 transition-colors">Track Your Order</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-glow-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-glow-400 transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Glow Newsletter</h4>
          <p className="text-xs text-slate-400 mb-4">
            Subscribe to receive exclusive beauty promo codes and flash sale alerts.
          </p>

          <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-3 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-glow-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-glow-400 hover:text-white p-1">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 DM-GLOWCART. All rights reserved. Built for B.Sc. IT Final Year Project.</p>
        <p className="flex items-center gap-2">
          <span>Razorpay Test Gateway Integrated</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
