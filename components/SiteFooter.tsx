import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="ink-bg border-t border-gold-deep/40 px-5 py-10 text-cream/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-script text-3xl text-shimmer">The Sugarland</p>
          <p className="mt-2 max-w-xs text-sm">A mouthful treat for everyone. Home-baked, hand-decorated, delivered fresh across Karachi.</p>
        </div>

        <div className="flex gap-12 text-sm">
          <div>
            <p className="mb-2 font-display font-semibold text-gold">Shop</p>
            <ul className="space-y-1">
              <li><Link href="/shop" className="hover:text-gold">Premade Cakes</Link></li>
              <li><Link href="/custom-order" className="hover:text-gold">Custom Orders</Link></li>
              <li><Link href="/track-order" className="hover:text-gold">Track an Order</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-display font-semibold text-gold">Connect</p>
            <ul className="space-y-1">
              <li>
                <a href="https://www.instagram.com/the__sugarland/" target="_blank" rel="noreferrer" className="hover:text-gold">
                  Instagram
                </a>
              </li>
              <li>Cash on Delivery only</li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-cream/40">© {new Date().getFullYear()} The Sugarland. All rights reserved.</p>
    </footer>
  );
}
