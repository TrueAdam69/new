'use client';

import { useState } from 'react';
import Image from 'next/image';

const STEPS = [
  {
    id: 1,
    title: 'Browse the Collection',
    description:
      'Visit our Catalogue page and explore our embroidered unstitched suits. Use filters to find pieces by category, color, or price. Take your time discovering the perfect piece.',
    imagePosition: 'right',
    image:
      'https://res.cloudinary.com/dkifrpcen/image/upload/v1775298113/1_pbhqdj.png',
  },
  {
    id: 2,
    title: 'Select & Request',
    description:
      'Found your fabric dream? Simply click the gold "Order Now" button on the product page. A pre-filled WhatsApp message with your selected item will be ready to send.',
    imagePosition: 'left',
    image:
      'https://res.cloudinary.com/dkifrpcen/image/upload/v1775298114/2_r0juzo.png',
  },
  {
    id: 3,
    title: 'Personalized Concierge',
    description:
      'Our artisan service will assist you with WhatsApp to confirm availability, discuss any customization, and answer your questions. We typically respond within 2 hours.',
    imagePosition: 'right',
    image:
      'https://res.cloudinary.com/dkifrpcen/image/upload/v1775298113/3_ht1cnv.png',
  },
  {
    id: 4,
    title: 'Secure Settlement',
    description:
      'We accept payment via EasyPaisa and direct bank transfer. Once your order is confirmed, payment details will be shared. No advance payment needed before confirmation.',
    imagePosition: 'left',
    image:
      'https://res.cloudinary.com/dkifrpcen/image/upload/v1775298113/5_b1qvcm.png',
  },
  {
    id: 5,
    title: 'Global Dispatch',
    description:
      'Your package is carefully wrapped in our signature luxury box and dispatched via registered courier service across Pakistan. Estimated delivery: 3–7 business days depending on location.',
    imagePosition: 'right',
    image:
      'https://res.cloudinary.com/dkifrpcen/image/upload/v1775298113/4_rh7wdw.png',
  },
];

const FAQS = [
  {
    id: 1,
    question: 'What is your return policy?',
    answer:
      'We accept returns within 14 days of delivery for unworn items in original packaging. Please contact us via WhatsApp to arrange a return. Shipping costs are the customer\'s responsibility.',
  },
  {
    id: 2,
    question: 'Standard delivery timeframe?',
    answer:
      'Standard delivery anywhere in Pakistan takes 3-7 business days depending on your location. We offer expedited delivery for an additional fee upon request.',
  },
  {
    id: 3,
    question: 'Is international shipping available?',
    answer:
      'We primarily ship within Pakistan. For international inquiries, please reach out directly via WhatsApp and we can discuss custom arrangements on a case-by-case basis.',
  },
  {
    id: 4,
    question: 'What if I don\'t have WhatsApp?',
    answer:
      'While WhatsApp is our primary channel for orders, you can also reach us via Instagram (@elesh_clothing) or email at contact@elesh.com. Response time may vary.',
  },
  {
    id: 5,
    question: 'Do you offer custom embroidery?',
    answer:
      'Yes! We love working with clients on custom projects. Please whatsapp or email us with your specific requirements and we can provide a timeline and quote within 24 hours.',
  },
];

export default function HowToOrderPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-50 to-yellow-100" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(100, 150, 255, 0.3) 0%, transparent 50%)',
        }} />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(255, 150, 150, 0.3) 0%, transparent 50%)',
        }} />

        <div className="relative flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-5xl font-light text-charcoal lg:text-6xl">
              How to Order
            </h1>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-charcoal/60">
              The Journey From Selection to Your Doorstep
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-20">
            {STEPS.map((step, idx) => (
              <div
                key={step.id}
                className={cn(
                  'grid items-center gap-12',
                  step.imagePosition === 'right' ? 'lg:grid-cols-2' : 'lg:grid-cols-2'
                )}
              >
                {/* Content */}
                <div
                  className={cn(
                    'space-y-4',
                    step.imagePosition === 'right'
                      ? 'lg:order-1'
                      : 'lg:order-2'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold text-sm font-medium text-charcoal">
                      {step.id}
                    </div>
                    <h2 className="font-heading text-2xl text-charcoal lg:text-3xl">
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-charcoal/70 lg:ml-10">
                    {step.description}
                  </p>
                </div>

                {/* Image */}
                <div
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-lg bg-charcoal',
                    step.imagePosition === 'right'
                      ? 'lg:order-2'
                      : 'lg:order-1'
                  )}
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-border-gold bg-white/30 px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-4xl text-charcoal">
              Clarifications
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">
              Helpful Answers for Confident Shopping
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => (
              <div
                key={faq.id}
                className="border border-border-gold bg-white overflow-hidden rounded-lg transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left transition-colors duration-200 hover:bg-gold-hover"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-charcoal">
                      {faq.question}
                    </h3>
                    <svg
                      className={cn(
                        'h-5 w-5 flex-shrink-0 text-gold transition-transform duration-300',
                        expandedFaq === faq.id ? 'rotate-180' : ''
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </button>

                {expandedFaq === faq.id && (
                  <div className="border-t border-border-gold bg-white/50 px-6 py-4">
                    <p className="text-charcoal/70">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional help */}
          <div className="mt-12 rounded-lg border border-border-gold bg-white p-6 text-center">
            <p className="mb-4 text-sm text-charcoal">
            Did you find your answer?
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-gold px-6 py-2 font-medium text-charcoal transition-all duration-200 hover:bg-gold-dark hover:shadow-gold"
            >
              Chat with Us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
