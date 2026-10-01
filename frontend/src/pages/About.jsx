import React from 'react';
import { Sparkles, Heart, ShieldCheck, Award, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-glow-600 to-rose-400 text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
          About DM-GLOWCART
        </h1>
        <p className="text-sm font-semibold tracking-wider text-glow-600 uppercase">
          Everyday Essentials, Made Better
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-rose-100 p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-slate-900">Our Vision & Mission</h2>
          <p>
            DM-GLOWCART was born out of a desire to create a modern, luxurious, yet accessible e-commerce shopping experience inspired by leading beauty platforms like Nykaa and Purplle, but crafted with a 100% original identity, refined rose gold aesthetics, and clean technical execution.
          </p>
          <p>
            Developed as a comprehensive <strong>B.Sc. Information Technology final-year project</strong>, DM-GLOWCART features a fully working Node.js + Express backend, Mongoose database modeling with MongoDB, JWT security, and a real Razorpay Test Mode integration for payment signature verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 text-center">
          <div className="p-4 bg-rose-50/60 rounded-2xl">
            <Award className="w-6 h-6 text-glow-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-xs">Premium Quality</h4>
            <p className="text-[11px] text-slate-500 mt-1">Dermatologically tested formulas</p>
          </div>
          <div className="p-4 bg-rose-50/60 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-glow-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-xs">Razorpay Security</h4>
            <p className="text-[11px] text-slate-500 mt-1">HMAC SHA256 Signature verification</p>
          </div>
          <div className="p-4 bg-rose-50/60 rounded-2xl">
            <Sparkles className="w-6 h-6 text-glow-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-xs">Smart Glow Match</h4>
            <p className="text-[11px] text-slate-500 mt-1">Custom recommendation finder</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-slate-900">Project Details:</p>
            <p className="text-slate-500">Student: Monisha • B.Sc. Information Technology Final Year</p>
            <p className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-glow-600" /> Location: Tiruppur, Tamil Nadu, India
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-glow-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-glow hover:bg-glow-700"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
