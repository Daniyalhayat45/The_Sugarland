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
      <section className="ink-bg relative overflow-hidden px-5 py-20 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-plum/25 blur-3xl" />
        </div>
        <div className="relative">
          <span className="eyebrow"><span>The Menu</span></span>
          <h1 className="mt-5 font-display text-5xl font-bold text-cream md:text-6xl">
            Shop our <span className="font-script text-shimmer">bakes</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-cream/70">
            Browse cakes, cupcakes, and pastries. Everything is baked to order the morning of delivery.
          </p>
        </div>
      </section>
      <DripDivider fill="#1B1512" />

      <section className="quilted-bg px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const isActive = (category ?? "ALL") === key;
              return (
                <a
                  key={key}
                  href={key === "ALL" ? "/shop" : `/shop?category=${key}`}
                  className={`rounded-full border px-5 py-2 font-body text-[11px] uppercase tracking-[0.28em] transition ${
                    isActive
                      ? "border-ink bg-ink text-cream shadow-[0_8px_20px_-8px_rgba(27,21,18,0.5)]"
                      : "border-ink/20 bg-white/60 text-ink/70 hover:border-plum hover:text-plum"
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
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
