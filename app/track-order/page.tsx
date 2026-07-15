"use client";

import { useState, FormEvent } from "react";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "BAKING", "READY", "DELIVERED"];

type OrderResult = {
  trackingCode: string;
  status: string;
  deliveryDate: string;
  deliveryAddress: string;
  items: { product: { name: string }; quantity: number }[];
  customCake: { flavor: string; size: string } | null;
};

export default function TrackOrderPage() {
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingCode: form.get("trackingCode"),
          phone: form.get("phone"),
        }),
      });
      if (!res.ok) {
        setError("We couldn't find an order matching those details. Please double check and try again.");
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const activeStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <section className="quilted-bg min-h-[70vh] px-5 py-14">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-center font-display text-3xl font-bold text-ink">Track Your Order</h1>
        <p className="mb-8 text-center text-ink/60">Enter your tracking code and phone number to see your order status.</p>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white/70 p-6 shadow-sm">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink/80">Tracking code</span>
            <input
              name="trackingCode"
              required
              placeholder="CAKE-XXXXXX"
              className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 uppercase outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink/80">Phone number used at checkout</span>
            <input
              name="phone"
              required
              type="tel"
              className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink py-2.5 text-sm font-semibold uppercase tracking-widest text-cream transition hover:bg-plum disabled:opacity-60"
          >
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

        {order && (
          <div className="mt-8 rounded-3xl bg-white/70 p-6 shadow-sm">
            <p className="font-display text-lg font-semibold text-ink">{order.trackingCode}</p>
            <p className="text-sm text-ink/60">
              Delivery on {new Date(order.deliveryDate).toLocaleDateString()} to {order.deliveryAddress}
            </p>

            <div className="mt-6 flex items-center justify-between">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      i <= activeStepIndex ? "bg-gold" : "bg-ink/15"
                    }`}
                  />
                  <span className={`mt-2 text-[10px] uppercase tracking-wide ${i <= activeStepIndex ? "text-ink" : "text-ink/40"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-ink/70">
              {order.customCake ? (
                <p>Custom cake: {order.customCake.flavor}, {order.customCake.size}</p>
              ) : (
                <ul className="list-disc pl-4">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.product.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
