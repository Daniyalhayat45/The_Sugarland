import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="ink-bg relative border-t border-gold-deep/40 px-5 pt-14 pb-8 text-cream/70">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-script text-shimmer text-4xl leading-none">The Sugarland</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            A mouthful treat for everyone. Home-baked, hand-decorated,
            delivered fresh across Karachi.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <span className="h-px w-8 bg-gold/50" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-gold/80">Cash on Delivery</span>
          </div>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-display font-semibold text-gold">Shop</p>
          <ul className="space-y-2">
            <li><Link href="/shop" className="hover:text-gold">Premade Cakes</Link></li>
            <li><Link href="/shop?category=CUPCAKE" className="hover:text-gold">Cupcakes</Link></li>
            <li><Link href="/shop?category=PASTRY" className="hover:text-gold">Pastries</Link></li>
            <li><Link href="/custom-order" className="hover:text-gold">Custom Orders</Link></li>
            <li><Link href="/track-order" className="hover:text-gold">Track an Order</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-display font-semibold text-gold">Connect</p>
          <ul className="space-y-2">
            <li>
              <a href="https://www.instagram.com/the__sugarland/" target="_blank" rel="noreferrer" className="hover:text-gold">
                @the__sugarland
              </a>
            </li>
            <li>Karachi, Pakistan</li>
            <li>Bakes daily · Order 48h ahead</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-gold-deep/30 pt-6 text-xs text-cream/45 md:flex-row">
        <p>© {new Date().getFullYear()} The Sugarland. All rights reserved.</p>
        <p className="font-body uppercase tracking-[0.3em]">Baked with love · Karachi</p>
      </div>
    </footer>
  );
}
