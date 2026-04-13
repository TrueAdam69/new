'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Clear the admin cookie by setting it to empty
    document.cookie = 'elesh_admin=; path=/; max-age=0';
    router.push('/Limitless89king');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 z-40 h-screen w-64 overflow-y-auto border-r border-gray-200 bg-charcoal transition-all duration-300 lg:relative lg:translate-x-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="space-y-8 p-6">
          {/* Logo */}
          <Link href="/Limitless89king/products" className="block">
            <div className="text-xl font-medium tracking-widest text-gold">
              ELESH
            </div>
            <div className="text-xs uppercase tracking-wider text-ivory/60">
              Atelier Admin
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link
              href="/Limitless89king/products"
              className={cn(
                'block rounded-lg px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors duration-200',
                isActive('/Limitless89king/products')
                  ? 'bg-gold text-charcoal'
                  : 'text-ivory hover:bg-charcoal/50'
              )}
            >
              📦 Collections
            </Link>

            <Link
              href="/Limitless89king/products/new"
              className={cn(
                'block rounded-lg px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors duration-200',
                isActive('/Limitless89king/products/new')
                  ? 'bg-gold text-charcoal'
                  : 'text-ivory hover:bg-charcoal/50'
              )}
            >
              ➕ New Entry
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg px-4 py-2 text-sm font-medium uppercase tracking-wider text-ivory transition-colors duration-200 hover:bg-charcoal/50"
            >
              🌐 Public View
            </a>
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-900/20 px-4 py-2 text-sm font-medium uppercase tracking-wider text-red-300 transition-colors duration-200 hover:bg-red-900/40"
          >
            Exit
          </button>
        </div>
      </aside>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="border-b border-gray-200 bg-white px-6 py-4 lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg lg:hidden border border-gray-300 p-2 text-charcoal hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="font-heading text-2xl text-charcoal">
              ELESH Admin
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="hidden lg:block rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors duration-200 hover:bg-red-100"
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
