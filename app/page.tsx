import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryShowcase from "@/components/CategoryShowcase";

export const metadata: Metadata = {
  title: "Elesh Clothing | Home",
  description: "Pakistani premium embroidered unstitched lawn by Elesh Clothing."
};

const heroImage =
  process.env.NEXT_PUBLIC_HERO_IMAGE_URL ||
  "https://images.unsplash.com/photo-1458696352784-ffe1f47c2edc?auto=format&fit=crop&w=2000&q=80";

export default function HomePage() {
  return (
    <>
      <section className="relative h-[90vh] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt="Elesh embroidered fabric"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(26,26,26,0.55)]" />
        <div className="page-shell relative flex h-full items-center justify-center text-center">
          <div className="page-fade max-w-3xl text-ivory">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-gold">
              New Collection 2025
            </p>
            <h1 className="mt-5 text-4xl font-light leading-tight text-ivory sm:text-6xl lg:text-7xl">
              Embroidered Heritage.
              <br />
              Modern Grace.
            </h1>
            <Link href="/catalogue" className="gold-button mt-8 inline-flex">
              Explore Collection
            </Link>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/80">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="animate-bounce-down"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      <section className="page-shell py-16">
        <h2 className="text-center text-3xl font-medium text-charcoal">
          Browse by Category
        </h2>
        <CategoryShowcase />
      </section>

      <section className="page-shell pb-16">
        <div className="text-center">
          <p className="text-2xl font-medium text-charcoal">The Featured Edit</p>
        </div>
        <div className="mt-10">
          <FeaturedProducts />
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/catalogue" className="outlined-button">
            View All Collections
          </Link>
        </div>
      </section>

      <section className="border-t border-border-gold/40 bg-ivory">
        <div className="page-shell py-16 text-center">
          <h3 className="text-2xl font-medium text-charcoal">Join The Atelier</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal/70">
            Receive first access to new embroidered drops, curated edits, and
            seasonal lookbooks.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded border border-border-gold bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/50"
            />
            <button type="button" className="gold-button">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
