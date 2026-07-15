import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import DripDivider from "@/components/DripDivider";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [signature, featured] = await Promise.all([
    prisma.product.findFirst({ where: { category: "SPECIALTY" }, orderBy: { createdAt: "asc" } }),
    prisma.product.findMany({ where: { isAvailable: true }, orderBy: { createdAt: "asc" }, take: 4 }),
  ]);

  return (
    <>
      {/* Hero: dark tier, the top layer of the cake */}
      <section className="ink-bg relative overflow-hidden px-5 pb-20 pt-16 text-center md:pt-24">
        <p className="mb-4 font-body text-xs uppercase tracking-[0.35em] text-gold/70">
          Home-baked in Karachi · Cash on Delivery
        </p>
        <h1 className="font-script text-shimmer animate-wobble inline-block text-6xl leading-none md:text-8xl">
          The Sugarland
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-display text-lg text-cream/80 md:text-xl">
          A mouthful treat for everyone. Custom cakes and premade favorites,
          hand-decorated and delivered fresh to your door.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-gold px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-ink transition hover:bg-gold-light"
          >
            Shop Cakes
          </Link>
          <Link
            href="/custom-order"
            className="rounded-full border border-gold/60 px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-cream transition hover:border-gold hover:text-gold"
          >
            Design a Custom Cake
          </Link>
        </div>
      </section>
      <DripDivider fill="#1B1512" />

      {/* Signature slice: the cream tier beneath */}
      <section className="quilted-bg px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          {signature && (
            <>
              <div className="animate-rise relative aspect-square overflow-hidden rounded-3xl shadow-xl">
                <Image src={signature.imageUrl} alt={signature.name} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
              </div>
              <div>
                <p className="mb-3 font-body text-xs uppercase tracking-[0.35em] text-plum">Our Signature</p>
                <h2 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
                  {signature.name}
                </h2>
                <p className="mt-4 text-ink/70">{signature.description}</p>
                <div className="mt-6 flex items-center gap-6">
                  <span className="font-display text-2xl font-semibold text-plum">${signature.price.toFixed(2)}</span>
                  <Link
                    href={`/shop/${signature.id}`}
                    className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-plum"
                  >
                    View cake
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured grid, still on the cream tier */}
      <section className="quilted-bg px-5 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">Fresh from the oven</h2>
            <Link href="/shop" className="font-body text-sm uppercase tracking-widest text-plum hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
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
        </div>
      </section>

      <DripDivider fill="#1B1512" flip />

      {/* Custom order CTA: back to the dark tier */}
      <section className="ink-bg px-5 py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-cream md:text-4xl">
          Got something specific in mind?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-cream/70">
          Tell us the flavor, size, and design you're dreaming of. We'll call you to confirm
          every detail before your cake goes in the oven.
        </p>
        <Link
          href="/custom-order"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-ink transition hover:bg-gold-light"
        >
          Start Your Custom Order
        </Link>
      </section>
    </>
  );
}
