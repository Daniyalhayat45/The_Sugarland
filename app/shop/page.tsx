import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import DripDivider from "@/components/DripDivider";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  ALL: "All",
  PREMADE: "Cakes",
  CUPCAKE: "Cupcakes",
  PASTRY: "Pastries",
  SPECIALTY: "Specialty",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category?.toUpperCase();
  const products = await prisma.product.findMany({
    where: category && category !== "ALL" ? { category: category as any } : {},
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <section className="ink-bg px-5 py-14 text-center">
        <p className="font-body text-xs uppercase tracking-[0.35em] text-gold/70">The Menu</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-cream">Shop Our Bakes</h1>
      </section>
      <DripDivider fill="#1B1512" />

      <section className="quilted-bg px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap gap-2">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const isActive = (category ?? "ALL") === key;
              return (
                <a
                  key={key}
                  href={key === "ALL" ? "/shop" : `/shop?category=${key}`}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    isActive
                      ? "border-ink bg-ink text-cream"
                      : "border-ink/20 text-ink/70 hover:border-ink/50"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>

          {products.length === 0 ? (
            <p className="py-20 text-center text-ink/60">
              Nothing here yet — check back soon or try a different category.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    servings: product.servings,
                    stockQty: product.stockQty,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
