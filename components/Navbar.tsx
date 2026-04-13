"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { SITE_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = useMemo(() => SITE_NAV_LINKS, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-gold bg-ivory/95 backdrop-blur">
        <div className="page-shell flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="font-heading text-lg font-medium tracking-brand text-gold"
          >
            ELESH
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-charcoal md:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative pb-1 transition-colors hover:text-gold",
                    isActive && "text-gold"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute left-0 top-full h-0.5 w-full scale-x-0 bg-gold transition-transform",
                      isActive && "scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-charcoal transition hover:text-gold md:flex"
              aria-label="Search"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition hover:text-gold md:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-charcoal/70 transition-opacity md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[80%] max-w-sm bg-ivory px-8 py-10 transition-transform md:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg font-medium tracking-brand text-gold">
            ELESH
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="h-9 w-9 rounded-full text-charcoal transition hover:text-gold"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <nav className="mt-10 flex flex-col gap-6 text-2xl font-light text-charcoal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-gold"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="transition-colors hover:text-gold"
            onClick={() => setMenuOpen(false)}
          >
            Search
          </Link>
        </nav>
      </aside>
    </>
  );
}
