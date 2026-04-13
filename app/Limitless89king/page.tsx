'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/Limitless89king/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/Limitless89king/products');
      } else {
        const data = await response.json();
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/">
            <h1 className="font-heading text-4xl tracking-widest text-gold">
              ELESH
            </h1>
          </Link>
        </div>

        {/* Form Card */}
        <div className="rounded-lg border border-border-gold bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-center font-heading text-2xl text-charcoal">
            Admin Access
          </h2>
          <p className="mb-8 text-center text-sm text-charcoal/60">
            Enter the admin password to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-wider text-charcoal">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-border-gold bg-white/50 px-4 py-3 text-charcoal placeholder-charcoal/30 transition-colors duration-200 focus:border-gold focus:bg-white focus:outline-none"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-charcoal px-6 py-3 font-medium uppercase tracking-wider text-ivory transition-all duration-200 disabled:opacity-50 hover:bg-black"
            >
              {loading ? 'Entering...' : 'Enter'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-charcoal/50">
          This is a protected area. Only authorized access allowed.
        </p>
      </div>
    </main>
  );
}
