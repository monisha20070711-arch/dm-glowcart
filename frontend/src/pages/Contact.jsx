import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await API.post('/contact', {
        name,
        email,
        subject,
        message
      });

      if (res.data.success) {
        showToast(res.data.message, 'success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit form';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-glow-600">Get In Touch</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">Contact DM-GLOWCART</h1>
        <p className="text-xs text-slate-500">
          Have a question regarding beauty orders or product recommendations? Reach out to our customer care team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-glow-600 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Head Office Location</h4>
                <p className="text-xs text-slate-500 mt-0.5">Tiruppur, Tamil Nadu, India</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-glow-600 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Support Email</h4>
                <a href="mailto:monisha20070711@gmail.com" className="text-xs text-glow-600 font-semibold hover:underline">
                  monisha20070711@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-slate-900">Send Us A Message</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Monisha"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-glow-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="monisha20070711@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-glow-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Product Inquiry / Order Status"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-glow-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Message</label>
              <textarea
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-glow-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-glow-600 hover:bg-glow-700 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-glow flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
