"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden
        className={`fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Side panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/50 transition hover:bg-ink/5 hover:text-ink"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-4xl">🛒</p>
            <p className="text-ink/60">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-plum"
            >
              Browse the Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 rounded-xl bg-white/70 p-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-ink/50">${item.price.toFixed(2)} each</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-6 w-6 rounded-full border border-ink/20 text-xs text-ink hover:border-ink"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-6 w-6 rounded-full border border-ink/20 text-xs text-ink hover:border-ink"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-display text-sm font-semibold text-plum">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-ink/40 hover:text-plum"
                      aria-label={`Remove ${item.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink/10 px-5 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-base text-ink">Total</span>
                <span className="font-display text-xl font-bold text-plum">${totalPrice.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full rounded-full bg-gold py-3 text-center font-body text-sm font-semibold uppercase tracking-widest text-ink transition hover:bg-gold-light"
              >
                Checkout
              </Link>
              <p className="mt-2 text-center text-xs text-ink/40">Cash on Delivery</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
