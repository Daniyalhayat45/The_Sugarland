"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <section className="quilted-bg px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Nothing to check out yet</h1>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-widest text-cream hover:bg-plum">
          Browse the Shop
        </Link>
      </section>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const payload = {
      type: "PREMADE",
      customerName: form.get("customerName"),
      phone: form.get("phone"),
      deliveryAddress: form.get("deliveryAddress"),
      deliveryDate: form.get("deliveryDate"),
      notes: form.get("notes"),
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Something went wrong placing your order.");
      const data = await res.json();
      clearCart();
      router.push(`/order-confirmation/${data.trackingCode}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section className="quilted-bg px-5 py-14">
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white/70 p-8 shadow-sm">
          <h1 className="mb-4 font-display text-2xl font-bold text-ink">Delivery Details</h1>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink/80">Full name</span>
            <input name="customerName" required className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink/80">Phone number</span>
            <input name="phone" type="tel" required className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink/80">Delivery address</span>
            <input name="deliveryAddress" required className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink/80">Preferred delivery date</span>
            <input name="deliveryDate" type="date" required className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink/80">Notes (optional)</span>
            <textarea name="notes" rows={2} className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep" />
          </label>

          <div className="rounded-lg bg-gold/10 px-4 py-3 text-sm text-ink/70">
            💵 Payment method: <strong>Cash on Delivery</strong>. We'll call to confirm your order shortly.
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold uppercase tracking-widest text-ink transition hover:bg-gold-light disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </form>

        <div className="h-fit rounded-3xl bg-ink p-8 text-cream">
          <h2 className="mb-4 font-display text-xl font-bold">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-cream/20 pt-4 font-display text-lg font-semibold">
            <span>Total</span>
            <span className="text-gold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
