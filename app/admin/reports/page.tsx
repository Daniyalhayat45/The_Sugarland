import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  PREMADE: "Cakes (Premade)",
  CUPCAKE: "Cupcakes",
  PASTRY: "Pastries",
  SPECIALTY: "Specialty",
};

export default async function AdminReportsPage() {
  const [orderItems, customOrderCount, totalOrders, deliveredOrders] = await Promise.all([
    prisma.orderItem.findMany({
      include: { product: true },
    }),
    prisma.order.count({ where: { type: "CUSTOM" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "DELIVERED" } }),
  ]);

  // Aggregate by category
  const byCategory: Record<string, { quantity: number; revenue: number }> = {};
  // Aggregate by individual product (best sellers)
  const byProduct: Record<string, { name: string; category: string; quantity: number; revenue: number }> = {};

  for (const item of orderItems) {
    const category = item.product.category;
    const revenue = item.price * item.quantity;

    if (!byCategory[category]) byCategory[category] = { quantity: 0, revenue: 0 };
    byCategory[category].quantity += item.quantity;
    byCategory[category].revenue += revenue;

    if (!byProduct[item.productId]) {
      byProduct[item.productId] = { name: item.product.name, category, quantity: 0, revenue: 0 };
    }
    byProduct[item.productId].quantity += item.quantity;
    byProduct[item.productId].revenue += revenue;
  }

  const categoryRows = Object.entries(byCategory).sort((a, b) => b[1].revenue - a[1].revenue);
  const topProducts = Object.values(byProduct)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 8);

  const totalPremadeRevenue = categoryRows.reduce((sum, [, v]) => sum + v.revenue, 0);
  const totalPremadeQty = categoryRows.reduce((sum, [, v]) => sum + v.quantity, 0);
  const maxQty = Math.max(1, ...topProducts.map((p) => p.quantity));

  return (
    <>
      <AdminNav />
      <section className="quilted-bg min-h-screen px-5 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 font-display text-2xl font-bold text-ink">Sales Report</h1>

          {/* Top stat cards */}
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total orders" value={totalOrders.toString()} />
            <StatCard label="Delivered" value={deliveredOrders.toString()} />
            <StatCard label="Custom cake orders" value={customOrderCount.toString()} />
            <StatCard label="Premade items sold" value={totalPremadeQty.toString()} />
          </div>

          {/* Revenue by category */}
          <div className="mb-10 rounded-2xl bg-white/80 p-6 shadow-sm">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">Sales by Category</h2>
            {categoryRows.length === 0 ? (
              <p className="text-sm text-ink/50">No premade sales yet.</p>
            ) : (
              <div className="space-y-3">
                {categoryRows.map(([category, data]) => {
                  const pct = totalPremadeRevenue > 0 ? (data.revenue / totalPremadeRevenue) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-ink">{CATEGORY_LABELS[category] || category}</span>
                        <span className="text-ink/60">
                          {data.quantity} sold · ${data.revenue.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <p className="pt-2 text-xs italic text-ink/40">
                  Custom cake orders aren't included here since final pricing is confirmed by phone —
                  see the {customOrderCount} custom order{customOrderCount === 1 ? "" : "s"} count above.
                </p>
              </div>
            )}
          </div>

          {/* Best sellers */}
          <div className="rounded-2xl bg-white/80 p-6 shadow-sm">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">Best-Selling Products</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-ink/50">No sales data yet.</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-4">
                    <span className="w-5 shrink-0 font-display text-sm font-bold text-ink/40">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate font-medium text-ink">{p.name}</span>
                        <span className="ml-2 shrink-0 text-ink/60">{p.quantity} sold</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                        <div
                          className="h-full rounded-full bg-plum"
                          style={{ width: `${(p.quantity / maxQty) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-16 shrink-0 text-right font-display text-sm font-semibold text-plum">
                      ${p.revenue.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-ink px-4 py-4 text-cream">
      <p className="text-xs uppercase tracking-widest text-cream/60">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-gold">{value}</p>
    </div>
  );
}
