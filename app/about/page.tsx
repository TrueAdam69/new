'use client';

import Link from 'next/link';
import Image from 'next/image';

const PLACEHOLDER_IMAGE =
  'https://res.cloudinary.com/dkifrpcen/image/upload/v1775294146/logo_elesh_dazvag.png';

const PILLARS = [
  {
    id: 1,
    title: 'Quality',
    description: 'Only the finest fabrics and embroidery techniques.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Heritage',
    description: "Rooted in Pakistan's centuries-old textile tradition.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Modern Grace',
    description: 'Designs that belong in today\'s world.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden bg-gradient-to-r from-charcoal/80 to-charcoal/70">
        <Image
          src={PLACEHOLDER_IMAGE}
          alt="Elesh Heritage"
          fill
          className="absolute inset-0 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="relative flex h-full items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">
              Crafting Excellence
            </p>
            <h1 className="font-heading text-5xl font-light text-ivory lg:text-6xl">
              Our Story
            </h1>
          </div>
        </div>
      </div>

      {/* Brand Story Section */}
      <div className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Image with badge */}
           <div className="relative">
  <div className="relative aspect-[4.5/4] overflow-hidden rounded-lg bg-charcoal">
    <Image
      src={PLACEHOLDER_IMAGE}
      alt="Elesh Craftsmanship"
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  </div>

  {/* Est. Badge */}
  <div className="absolute bottom-0 left-0 -mb-6 -ml-6 flex flex-col items-center justify-center rounded-full bg-gray-200 p-6 shadow-lg">
    <p className="text-xs uppercase tracking-wider text-charcoal/60">Est.</p>
    <p className="text-2xl font-medium text-charcoal">2023</p>
  </div>
</div>
            {/* Right: Story Text */}
            <div className="space-y-6 pt-8 lg:pt-0">
              <h2 className="font-heading text-3xl text-charcoal lg:text-4xl">
                Heritage Reimagined for the Modern Woman
              </h2>

              <div className="space-y-4 text-charcoal/80">
                <p>
                  Elesh Clothing was born from a love of Pakistan's rich embroidery heritage. Every
                  piece in our collection is crafted with meticulous attention to detail — from the
                  hand-drawn motifs to the finest unstitched lawn fabric.
                </p>

                <p>
                  We believe that luxury lies in the unseen — the tension of a stitch, the
                  breathability of fine lawn, and the subtle shimmer of golden threads. Each collection
                  is a curated dialogue between timeless traditions and contemporary silhouettes.
                </p>

                <p>
                  Based in Faisalabad, Pakistan's city of textiles, we bring you premium embroidered
                  unstitched collections that honor the craft and celebrate the woman who wears it.
                </p>
              </div>

              <Link
                href="/catalogue"
                className="inline-block text-xs font-medium uppercase tracking-wider text-gold transition-colors duration-200 hover:text-gold-dark"
              >
                View Our Collections →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="border-t border-border-gold bg-white/30 px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-4xl text-charcoal">
              The Pillars of Elesh
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">
              Our Core Philosophy
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="rounded-lg border border-border-gold bg-white p-8 text-center transition-all duration-200 hover:border-gold hover:shadow-gold"
              >
                <div className="mb-4 flex justify-center text-gold">
                  {pillar.icon}
                </div>
                <h3 className="mb-3 font-heading text-xl text-charcoal">
                  {pillar.title}
                </h3>
                <p className="text-sm text-charcoal/70">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="bg-ivory px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <svg
            className="mx-auto mb-6 h-12 w-12 text-gold opacity-60"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.25-2.25-7-2-2 .75-4 3-4 5.972V11c0 1.25 0 4 4 4 .75 0 2-.25 2-1v-3c-.75 1-2.625 1.5-4 1.5-3 0-4-1-4-3.972V5c0-1.972 1-4 4-4 3 0 7 .5 7 8v13c0 1-1 2-2 2-1-1-1.972-2-5-2-6 0-8.75-4.5-8.75-8.972V5.75C2.25 2.25 3.5 0 6.972 0c3.5 0 6.75 2.5 6.75 7.972V20Zm15.75-10h-7V8c0-1.3.3-2 2-2h5V3c-1 0-5.2.5-7 .972C15.6 4.15 14 6.972 14 10v7c0 1-1 2-2 2s-2.3-.75-2.75-1c.425.675 1.587 2 5.75 2h5.75c1 0 2-1 2-2v-7c0-1-1-2-2-2Z" />
          </svg>

          <blockquote className="mb-6 font-heading text-2xl italic text-charcoal lg:text-3xl">
            "Clothing is the first layer of self-expression. At Elesh, we ensure that layer is woven
            with stories, tradition, and uncompromising beauty."
          </blockquote>

          <p className="text-xs uppercase tracking-wider text-charcoal/60">
            The Creative Director
          </p>
        </div>
      </div>
    </main>
  );
}
