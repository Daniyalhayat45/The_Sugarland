import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import OrderRow from "@/components/OrderRow";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = ["ALL", "PENDING", "CONFIRMED", "BAKING", "READY", "DELIVERED", "CANCELLED"];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = searchParams.status?.toUpperCase() || "ALL";

  const [orders, pendingCount, todayRevenue] = await Promise.all([
    prisma.order.findMany({
      where: statusFilter !== "ALL" ? { status: statusFilter as any } : {},
      include: { items: { include: { product: true } }, customCake: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      _sum: { totalEstimate: true },
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  return (
    <>
      <AdminNav />
      <section className="quilted-bg min-h-screen px-5 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Pending orders" value={pendingCount.toString()} />
            <StatCard label="Orders today" value={orders.filter((o) => isToday(o as any)).length.toString()} />
            <StatCard label="Est. revenue today" value={`$${(todayRevenue._sum.totalEstimate ?? 0).toFixed(2)}`} />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((s) => (
              <a
                key={s}
                href={s === "ALL" ? "/admin/dashboard" : `/admin/dashboard?status=${s}`}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  statusFilter === s ? "border-ink bg-ink text-cream" : "border-ink/20 text-ink/70 hover:border-ink/50"
                }`}
              >
                {s}
              </a>
            ))}
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="py-16 text-center text-ink/50">No orders in this view yet.</p>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={{
                    ...order,
                    deliveryDate: order.deliveryDate.toISOString(),
                  }}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function isToday(order: { createdAt: Date }) {
  const created = new Date(order.createdAt);
  const now = new Date();
  return (
    created.getFullYear() === now.getFullYear() &&
    created.getMonth() === now.getMonth() &&
    created.getDate() === now.getDate()
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-ink px-5 py-4 text-cream">
      <p className="text-xs uppercase tracking-widest text-cream/60">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-gold">{value}</p>
    </div>
  );
}
