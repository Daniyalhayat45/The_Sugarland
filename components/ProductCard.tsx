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
    <div className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-gold-deep/20 bg-white/60 shadow-sm">
      <Link href={`/shop/${product.id}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs uppercase tracking-widest text-cream">
            Sold out
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">{product.name}</h3>
        </Link>
        {product.servings && <p className="text-xs uppercase tracking-wide text-ink/50">{product.servings}</p>}
        <p className="line-clamp-2 text-sm text-ink/70">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-xl font-semibold text-plum">${product.price.toFixed(2)}</span>
          <AddToCartButton product={product} disabled={outOfStock} compact />
        </div>
      </div>
    </div>
  );
}
