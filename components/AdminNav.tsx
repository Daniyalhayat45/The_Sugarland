"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "Orders" },
  { href: "/admin/products", label: "Products" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="ink-bg sticky top-0 z-40 border-b border-gold-deep/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <span className="font-script text-2xl text-shimmer">The Sugarland — Admin</span>
        <nav className="flex items-center gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm uppercase tracking-widest transition ${
                pathname.startsWith(link.href) ? "text-gold" : "text-cream/70 hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="rounded-full border border-gold/50 px-4 py-1.5 text-sm text-cream transition hover:border-gold hover:text-gold"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}
