"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <section className="quilted-bg px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Your cart is empty</h1>
        <p className="mt-3 text-ink/60">Looks like you haven't added any treats yet.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-cream transition hover:bg-plum"
        >
          Browse the Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="quilted-bg px-5 py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 font-display text-3xl font-bold text-ink">Your Cart</h1>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 rounded-2xl bg-white/70 p-4 shadow-sm">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-ink">{item.name}</p>
                <p className="text-sm text-ink/60">${item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="h-7 w-7 rounded-full border border-ink/20 text-ink hover:border-ink"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="h-7 w-7 rounded-full border border-ink/20 text-ink hover:border-ink"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
              <p className="w-16 text-right font-display font-semibold text-plum">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-ink/40 hover:text-plum"
                aria-label={`Remove ${item.name} from cart`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between rounded-2xl bg-ink px-6 py-5">
          <span className="font-display text-lg text-cream">Total</span>
          <span className="font-display text-2xl font-semibold text-gold">${totalPrice.toFixed(2)}</span>
        </div>

        <Link
          href="/checkout"
          className="mt-6 block w-full rounded-full bg-gold py-3 text-center font-body text-sm font-semibold uppercase tracking-widest text-ink transition hover:bg-gold-light"
        >
          Proceed to Checkout
        </Link>
      </div>
    </section>
  );
}
