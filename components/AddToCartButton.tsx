"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

type Props = {
  product: { id: string; name: string; price: number; imageUrl: string };
  disabled?: boolean;
  compact?: boolean;
};

export default function AddToCartButton({ product, disabled, compact }: Props) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    if (disabled) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`rounded-full font-body text-sm font-medium transition ${
        compact ? "px-4 py-1.5" : "px-6 py-2.5"
      } ${
        disabled
          ? "cursor-not-allowed bg-ink/10 text-ink/40"
          : justAdded
          ? "bg-gold-deep text-cream"
          : "bg-ink text-cream hover:bg-plum"
      }`}
    >
      {disabled ? "Sold out" : justAdded ? "Added ✓" : "Add to cart"}
    </button>
  );
}
