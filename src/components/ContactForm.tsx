import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactFormProps {
  onSuccessCallback?: () => void;
}

export default function ContactForm({ onSuccessCallback }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/messages/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          type: 'success',
          message: result.message || 'Thank you! Your submission was sent successfully.',
        });
        setFormData({ name: '', company: '', email: '', subject: '', message: '' });
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again later.',
        });
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setStatus({
        type: 'error',
        message: 'Could not connect to the server. Please check your internet connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-form-container" className="bg-[#0D1117] border border-slate-800 p-8 rounded-none shadow-xl hover:border-indigo-500/30 transition-all duration-300">
      <h3 id="contact-header" className="text-xl font-bold text-white mb-2">Connect with Me</h3>
      <p id="contact-subheader" className="text-sm text-slate-400 mb-6">
        Let's collaborate on your next project, or discuss recruiter opportunities.
      </p>

      {status.type === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-none flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-sm font-semibold text-emerald-300 block">Message Sent!</span>
            <span className="text-xs text-emerald-400/80 mt-1 block">{status.message}</span>
          </div>
        </motion.div>
      )}

      {status.type === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-none flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-sm font-semibold text-rose-300 block">Submission Failed</span>
            <span className="text-xs text-rose-400/80 mt-1 block">{status.message}</span>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Your Name *
            </label>
            <input
              id="name-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={`w-full bg-[#0a0a0c] border ${
                validationErrors.name ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
              } text-white px-4 py-2 text-sm rounded-none outline-none transition-all duration-200`}
            />
            {validationErrors.name && (
              <span className="text-rose-500 text-xs mt-1 block font-mono">{validationErrors.name}</span>
            )}
          </div>

          <div>
            <label htmlFor="company-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Company / Agency
            </label>
            <input
              id="company-input"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Acme Corp"
              className="w-full bg-[#0a0a0c] border border-slate-800 focus:border-indigo-500 text-white px-4 py-2 text-sm rounded-none outline-none transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Email Address *
          </label>
          <input
            id="email-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. john@company.com"
            className={`w-full bg-[#0a0a0c] border ${
              validationErrors.email ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
            } text-white px-4 py-2 text-sm rounded-none outline-none transition-all duration-200`}
          />
          {validationErrors.email && (
            <span className="text-rose-500 text-xs mt-1 block font-mono">{validationErrors.email}</span>
          )}
        </div>

        <div>
          <label htmlFor="subject-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Subject *
          </label>
          <input
            id="subject-input"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Collaboration Opportunity / Job Offer"
            className={`w-full bg-[#0a0a0c] border ${
              validationErrors.subject ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
            } text-white px-4 py-2 text-sm rounded-none outline-none transition-all duration-200`}
          />
          {validationErrors.subject && (
            <span className="text-rose-500 text-xs mt-1 block font-mono">{validationErrors.subject}</span>
          )}
        </div>

        <div>
          <label htmlFor="message-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Your Message *
          </label>
          <textarea
            id="message-input"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Please detail your opportunity here..."
            className={`w-full bg-[#0a0a0c] border ${
              validationErrors.message ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
            } text-white px-4 py-2 text-sm rounded-none outline-none transition-all duration-200 resize-none`}
          ></textarea>
          {validationErrors.message && (
            <span className="text-rose-500 text-xs mt-1 block font-mono">{validationErrors.message}</span>
          )}
        </div>

        <button
          id="submit-contact-button"
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Request...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Inquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
