import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: { params: { trackingCode: string } }) {
  const order = await prisma.order.findUnique({
    where: { trackingCode: params.trackingCode },
    include: { items: { include: { product: true } }, customCake: true },
  });

  if (!order) notFound();

  return (
    <section className="ink-bg flex min-h-[70vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-cream p-8 text-center shadow-2xl md:p-12">
        <p className="text-5xl">🎂</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">Order Received!</h1>
        <p className="mt-2 text-ink/70">
          Thank you, {order.customerName}. We'll call {order.phone} shortly to confirm the details.
        </p>

        <div className="mt-6 rounded-2xl border border-dashed border-gold-deep bg-gold/10 px-6 py-4">
          <p className="text-xs uppercase tracking-widest text-ink/50">Your Tracking Code</p>
          <p className="mt-1 font-display text-2xl font-bold tracking-wider text-plum">{order.trackingCode}</p>
        </div>

        <div className="mt-6 space-y-2 text-left text-sm text-ink/70">
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Delivery date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Delivery address:</strong> {order.deliveryAddress}
          </p>
          <p>
            <strong>Payment:</strong> Cash on Delivery
          </p>
          {order.customCake && (
            <p>
              <strong>Custom cake:</strong> {order.customCake.flavor}, {order.customCake.size}
            </p>
          )}
          {order.items.length > 0 && (
            <div>
              <strong>Items:</strong>
              <ul className="ml-4 list-disc">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-ink/50">
          Save this code to check your order status anytime on the Track Order page.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-widest text-cream transition hover:bg-plum"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}
