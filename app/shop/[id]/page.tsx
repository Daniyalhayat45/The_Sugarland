import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  return (
    <section className="quilted-bg px-5 py-14">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        <div className="animate-rise relative aspect-square overflow-hidden rounded-3xl shadow-xl">
          <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
        </div>
        <div>
          <p className="font-body text-xs uppercase tracking-[0.35em] text-plum">
            {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">{product.name}</h1>
          {product.servings && <p className="mt-2 text-sm uppercase tracking-wide text-ink/50">{product.servings}</p>}
          <p className="mt-5 text-ink/70">{product.description}</p>
          <p className="mt-6 font-display text-3xl font-semibold text-plum">${product.price.toFixed(2)}</p>
          <div className="mt-6">
            <AddToCartButton product={product} disabled={product.stockQty <= 0} />
          </div>
          <p className="mt-4 text-xs text-ink/50">
            Payment is cash on delivery. We'll call you at checkout to confirm your order.
          </p>
        </div>
      </div>
    </section>
  );
}
