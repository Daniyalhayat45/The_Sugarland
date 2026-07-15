"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/custom-order", label: "Custom Order" },
  { href: "/track-order", label: "Track Order" },
];

export default function SiteHeader() {
  const { totalItems, toggleCart } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors backdrop-blur-md ${
        scrolled
          ? "border-gold-deep/50 bg-ink/85"
          : "border-gold-deep/25 bg-ink/60"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-script text-shimmer text-4xl leading-none">
          The Sugarland
        </Link>

        <nav className="hidden items-center gap-12 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative font-body text-[13px] uppercase tracking-[0.28em] text-cream/85 transition hover:text-gold"
            >
              {link.label}
              <span className="pointer-events-none absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleCart}
            className="relative inline-flex items-center gap-2 rounded-full bg-ink border border-gold/40 px-5 py-2 text-sm font-medium text-gold shadow-[0_4px_16px_-4px_rgba(0,0,0,0.6)] transition hover:border-gold hover:bg-ink-soft hover:text-gold-light"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 4h2l2.4 12.5a2 2 0 0 0 2 1.5h7.2a2 2 0 0 0 2-1.6L20 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="20" r="1.4" fill="currentColor"/>
              <circle cx="17" cy="20" r="1.4" fill="currentColor"/>
            </svg>
            Cart
            {totalItems > 0 && (
              <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="text-cream md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-gold-deep/30 bg-ink/95 px-5 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm uppercase tracking-widest text-cream/80 hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
