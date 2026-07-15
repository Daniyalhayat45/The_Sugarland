"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "BAKING", "READY", "DELIVERED", "CANCELLED"];
const PAYMENT_OPTIONS = ["UNPAID", "PAID"];

export type AdminOrder = {
  id: string;
  trackingCode: string;
  type: "PREMADE" | "CUSTOM";
  status: string;
  paymentStatus: string;
  customerName: string;
  phone: string;
  deliveryDate: string;
  totalEstimate: number;
  customCake: { flavor: string; size: string } | null;
  items: { product: { name: string }; quantity: number }[];
};

export default function OrderRow({ order }: { order: AdminOrder }) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [isPending, startTransition] = useTransition();

  function updateOrder(changes: { status?: string; paymentStatus?: string }) {
    startTransition(async () => {
      await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white/80 p-5 shadow-sm md:grid-cols-[1fr_auto_auto] md:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/orders/${order.id}`} className="font-display font-semibold text-ink hover:text-plum">
            {order.trackingCode}
          </Link>
          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs uppercase tracking-wide text-gold-deep">
            {order.type}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink/70">{order.customerName} · {order.phone}</p>
        <p className="text-xs text-ink/50">
          Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
        </p>
        <p className="mt-1 text-xs text-ink/60">
          {order.customCake
            ? `${order.customCake.flavor} — ${order.customCake.size}`
            : order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ")}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-ink/50">Status</label>
        <select
          value={status}
          disabled={isPending}
          onChange={(e) => {
            setStatus(e.target.value);
            updateOrder({ status: e.target.value });
          }}
          className="rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-ink/50">Payment</label>
        <select
          value={paymentStatus}
          disabled={isPending}
          onChange={(e) => {
            setPaymentStatus(e.target.value);
            updateOrder({ paymentStatus: e.target.value });
          }}
          className="rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm"
        >
          {PAYMENT_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
