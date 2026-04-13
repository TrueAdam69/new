'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import { SOCIAL_LINKS } from '@/lib/constants';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1534880190569-0f280be91481?auto=format&fit=crop&w=400&q=80';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923277854609';
    const text = encodeURIComponent(
      `Name: ${formData.name}%0APhone: ${formData.phone}%0AMessage: ${formData.message}`
    );

    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');

    // Reset form and show success message
    setFormData({ name: '', phone: '', message: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen bg-ivory">
      {/* Header */}
      <div className="border-b border-border-gold px-4 py-12 text-center sm:py-16 lg:px-8">
        <h1 className="mb-3 font-heading text-4xl font-light text-charcoal sm:text-5xl lg:text-6xl">
          Get in Touch
        </h1>
        <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">
          Curating Your Bespoke Luxury Experience
        </p>
      </div>

      {/* Main content */}
      <div className="page-shell py-8 sm:py-12">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Left: Contact Details */}
          <div className="space-y-8 sm:space-y-12">
            {/* WhatsApp */}
            <div>
              <h3 className="mb-2 text-xs uppercase tracking-wider text-charcoal/60">
                Connect WhatsApp
              </h3>
              <a
                href={SOCIAL_LINKS.whatsapp}
                className="text-lg sm:text-xl text-charcoal transition-colors duration-200 hover:text-gold"
              >
                +92 3277854609
              </a>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.3em] text-charcoal/60">
                Follow Us
              </h3>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                <Link
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-charcoal transition-colors duration-200 hover:text-gold"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                  Instagram
                </Link>
                <Link
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-charcoal transition-colors duration-200 hover:text-gold"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Link>
                <Link
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-charcoal transition-colors duration-200 hover:text-gold"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 48 48"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M41,16.1c-4,0-7.7-1.3-10.7-3.4v16.3c0,7.3-5.9,13.2-13.2,13.2S4,36.3,4,29s5.9-13.2,13.2-13.2
                      c1.3,0,2.6,0.2,3.8,0.6v5.6c-1.2-0.8-2.6-1.3-4.1-1.3c-4,0-7.2,3.2-7.2,7.2s3.2,7.2,7.2,7.2s7.2-3.2,7.2-7.2V4h6
                      c0.3,3.6,3.3,6.6,6.9,6.9V16.1z"/>
                  </svg>
                  TikTok
                </Link>
              </div>
            </div>

            {/* Email */}
            <div>
              <h3 className="mb-2 text-xs uppercase tracking-wider text-charcoal/60">
                Email Inquiry
              </h3>
              <a
                href="mailto:eleshpk@gmail.com"
                className="text-lg sm:text-xl text-charcoal transition-colors duration-200 hover:text-gold"
              >
                eleshpk@gmail.com
              </a>
            </div>

            {/* Location */}
            <div>
              <h3 className="mb-2 text-xs uppercase tracking-wider text-charcoal/60">
                Atelier Location
              </h3>
              <p className="text-lg sm:text-xl text-charcoal">Faisalabad, Pakistan</p>
              <p className="mt-2 text-xs text-charcoal/50">By appointment only</p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-charcoal">Inquiry Form</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  className="w-full border border-border-gold bg-white/50 px-4 py-3 text-sm text-charcoal placeholder-charcoal/40 transition-colors duration-200 focus:border-gold focus:bg-white focus:outline-none"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your WhatsApp number"
                  required
                  className="w-full border border-border-gold bg-white/50 px-4 py-3 text-sm text-charcoal placeholder-charcoal/40 transition-colors duration-200 focus:border-gold focus:bg-white focus:outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your inquiry or custom requirements..."
                  rows={5}
                  required
                  className="w-full border border-border-gold bg-white/50 px-4 py-3 text-sm text-charcoal placeholder-charcoal/40 transition-colors duration-200 focus:border-gold focus:bg-white focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gold px-6 py-3 text-sm font-medium uppercase tracking-wider text-charcoal transition-all duration-200 hover:bg-gold-dark hover:shadow-gold sm:py-4"
              >
                <span className="mr-2">📲</span>
                Send via WhatsApp
              </button>

              {/* Success message */}
              {submitted && (
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
                  Thank you! WhatsApp window opened. Please send the pre-filled message.
                </div>
              )}

              {/* Response time */}
              <p className="text-center text-xs text-charcoal/50">
                Typical response time: Within 2 hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
