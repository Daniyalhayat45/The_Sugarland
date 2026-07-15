import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import OrderRow from "@/components/OrderRow";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } }, customCake: true },
  });
  if (!order) notFound();

  return (
    <>
      <AdminNav />
      <section className="quilted-bg min-h-screen px-5 py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <OrderRow
            order={{
              ...order,
              deliveryDate: order.deliveryDate.toISOString(),
            }}
          />

          <div className="grid gap-6 rounded-2xl bg-white/80 p-6 shadow-sm md:grid-cols-2">
            <div>
              <h2 className="mb-2 font-display font-semibold text-ink">Customer</h2>
              <p className="text-sm text-ink/70">{order.customerName}</p>
              <p className="text-sm text-ink/70">{order.phone}</p>
              <p className="text-sm text-ink/70">{order.deliveryAddress}</p>
              <p className="mt-2 text-sm text-ink/70">
                Delivery date: {new Date(order.deliveryDate).toLocaleDateString()}
              </p>
              {order.notes && (
                <p className="mt-2 text-sm italic text-ink/60">Notes: {order.notes}</p>
              )}
            </div>

            {order.customCake ? (
              <div>
                <h2 className="mb-2 font-display font-semibold text-ink">Custom Cake Request</h2>
                <p className="text-sm text-ink/70">Flavor: {order.customCake.flavor}</p>
                <p className="text-sm text-ink/70">Size: {order.customCake.size} ({order.customCake.tierCount} tier)</p>
                <p className="text-sm text-ink/70">Budget: {order.customCake.budgetRange}</p>
                <p className="mt-2 text-sm text-ink/70">Design notes: {order.customCake.designNotes}</p>
                {order.customCake.referenceImageUrl && (
                  <div className="relative mt-3 aspect-square w-40 overflow-hidden rounded-xl">
                    <Image src={order.customCake.referenceImageUrl} alt="Reference" fill sizes="160px" className="object-cover" />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="mb-2 font-display font-semibold text-ink">Items Ordered</h2>
                <ul className="space-y-1 text-sm text-ink/70">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-display font-semibold text-plum">
                  Total: ${order.totalEstimate.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
