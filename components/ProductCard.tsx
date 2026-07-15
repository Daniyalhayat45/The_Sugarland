import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export type ProductCardData = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  servings: string | null;
  stockQty: number;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.stockQty <= 0;

  return (
    <div className="card-hover frame-gold group relative flex flex-col overflow-hidden rounded-2xl">
      <Link href={`/shop/${product.id}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition duration-[900ms] ease-out group-hover:scale-110"
        />
        {/* soft top-to-bottom cream fade at the image base for a magazine feel */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FBF7EE] to-transparent" />
        {outOfStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cream">
            Sold out
          </span>
        ) : (
          <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-ink/80">
            Fresh bake
          </span>
        )}
        <span className="absolute right-3 top-3 price-tag text-sm">
          ${product.price.toFixed(2)}
        </span>
      </Link>

      <div className="relative z-10 flex flex-1 flex-col gap-1.5 px-5 pb-5 pt-3">
        {product.servings && (
          <p className="text-[10px] uppercase tracking-[0.3em] text-plum/80">{product.servings}</p>
        )}
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-display text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-plum">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink/65">{product.description}</p>
        <div className="mt-3 flex items-center justify-between border-t border-gold/25 pt-3">
          <Link
            href={`/shop/${product.id}`}
            className="text-[11px] uppercase tracking-[0.28em] text-ink/60 transition hover:text-plum"
          >
            View details
          </Link>
          <AddToCartButton product={product} disabled={outOfStock} compact />
        </div>
      </div>
    </div>
  );
}
