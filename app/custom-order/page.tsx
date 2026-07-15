"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import DripDivider from "@/components/DripDivider";

export default function CustomOrderPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      type: "CUSTOM",
      customerName: form.get("customerName"),
      phone: form.get("phone"),
      deliveryAddress: form.get("deliveryAddress"),
      deliveryDate: form.get("deliveryDate"),
      notes: form.get("notes"),
      customCake: {
        flavor: form.get("flavor"),
        size: form.get("size"),
        tierCount: Number(form.get("tierCount")) || 1,
        designNotes: form.get("designNotes"),
        referenceImageUrl: form.get("referenceImageUrl") || null,
        budgetRange: form.get("budgetRange"),
      },
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Something went wrong submitting your request.");
      const data = await res.json();
      router.push(`/order-confirmation/${data.trackingCode}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="ink-bg px-5 py-14 text-center">
        <p className="font-body text-xs uppercase tracking-[0.35em] text-gold/70">Made to order</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-cream">Design Your Custom Cake</h1>
        <p className="mx-auto mt-3 max-w-xl text-cream/70">
          Fill in the details below. The owner will call you to confirm flavor, price, and design before baking begins.
        </p>
      </section>
      <DripDivider fill="#1B1512" />

      <section className="quilted-bg px-5 py-14">
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8 rounded-3xl bg-white/70 p-8 shadow-sm">
          <fieldset className="space-y-4">
            <legend className="font-display text-lg font-semibold text-ink">Cake Details</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Flavor" name="flavor" placeholder="e.g. Chocolate with Oreo filling" required />
              <Field label="Size" name="size" placeholder="e.g. 10 inch, 2 tier" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Number of tiers" name="tierCount" type="number" min={1} max={6} defaultValue={1} required />
              <Field label="Budget range (PKR)" name="budgetRange" placeholder="e.g. 5,000 - 7,000" required />
            </div>
            <TextArea label="Design notes" name="designNotes" placeholder="Theme, colors, message on cake, inspiration..." required />
            <Field
              label="Reference image URL (optional)"
              name="referenceImageUrl"
              placeholder="Paste a link to an inspiration photo"
            />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-display text-lg font-semibold text-ink">Delivery Details</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" name="customerName" required />
              <Field label="Phone number" name="phone" type="tel" required />
            </div>
            <Field label="Delivery address" name="deliveryAddress" required />
            <Field label="Delivery date" name="deliveryDate" type="date" required />
            <TextArea label="Any other notes" name="notes" placeholder="Anything else we should know?" />
          </fieldset>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-ink py-3 font-body text-sm font-semibold uppercase tracking-widest text-cream transition hover:bg-plum disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Custom Order Request"}
          </button>
          <p className="text-center text-xs text-ink/50">
            No payment now — cash on delivery. We'll call to confirm before we start baking.
          </p>
        </form>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  placeholder,
  min,
  max,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  defaultValue?: string | number;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink/80">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-ink outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink/80">{label}</span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-ink outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep"
      />
    </label>
  );
}
