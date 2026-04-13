import Link from "next/link";
import { SITE_NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg tracking-brand text-gold">ELESH</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ivory/80">
            Embroidered Heritage. Modern Grace.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-ivory/60">
            Navigate
          </p>
          <div className="flex flex-col gap-2">
            {SITE_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-gold">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-ivory/60">
            Connect
          </p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-gold"
              >
              <svg
                className="h-4 w-4"
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
              className="flex items-center gap-2 hover:text-gold"
              >
              <svg
                className="h-4 w-4"
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
              className="flex items-center gap-2 hover:text-gold"
              >
              <svg
                className="h-4 w-4"
                viewBox="0 0 48 48"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M41,16.1c-4,0-7.7-1.3-10.7-3.4v16.3c0,7.3-5.9,13.2-13.2,13.2S4,36.3,4,29s5.9-13.2,13.2-13.2
                  c1.3,0,2.6,0.2,3.8,0.6v5.6c-1.2-0.8-2.6-1.3-4.1-1.3c-4,0-7.2,3.2-7.2,7.2s3.2,7.2,7.2,7.2s7.2-3.2,7.2-7.2V4h6
                  c0.3,3.6,3.3,6.6,6.9,6.9V16.1z"/>
              </svg>Tiktok
              </Link>
            </div>
          <p>WhatsApp: +92 3277854609</p>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <p className="page-shell py-4 text-xs text-ivory/70">
          (c) 2025 Elesh Clothing. All orders are processed via WhatsApp.
        </p>
      </div>
    </footer>
  );
}
