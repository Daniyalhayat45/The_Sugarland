"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  servings: string | null;
  stockQty: number;
  isAvailable: boolean;
};

const CATEGORIES = ["PREMADE", "CUPCAKE", "PASTRY", "SPECIALTY"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    setProducts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      description: form.get("description"),
      price: form.get("price"),
      imageUrl: form.get("imageUrl"),
      category: form.get("category"),
      servings: form.get("servings"),
      stockQty: form.get("stockQty"),
    };
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    (e.target as HTMLFormElement).reset();
    setShowForm(false);
    load();
  }

  async function toggleAvailable(product: Product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !product.isAvailable }),
    });
    load();
  }

  async function updateStock(product: Product, stockQty: number) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockQty }),
    });
    load();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <AdminNav />
      <section className="quilted-bg min-h-screen px-5 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-ink">Products</h1>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  if (!confirm("Load sample products and orders? This replaces any existing data.")) return;
                  await fetch("/api/admin/seed", { method: "POST" });
                  load();
                }}
                className="rounded-full border border-gold-deep px-5 py-2 text-sm font-semibold text-gold-deep hover:bg-gold/10"
              >
                Load Sample Data
              </button>
              <button
                onClick={() => setShowForm((s) => !s)}
                className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-cream hover:bg-plum"
              >
                {showForm ? "Cancel" : "+ Add Product"}
              </button>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="mb-8 grid gap-4 rounded-2xl bg-white/80 p-6 shadow-sm sm:grid-cols-2">
              <Field label="Name" name="name" required />
              <Field label="Price ($)" name="price" type="number" step="0.01" required />
              <Field label="Image URL" name="imageUrl" required placeholder="https://picsum.photos/seed/newcake/800/800" />
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-ink/80">Category</span>
                <select name="category" required className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <Field label="Servings" name="servings" placeholder="e.g. 8-10 people" />
              <Field label="Stock quantity" name="stockQty" type="number" required />
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-medium text-ink/80">Description</span>
                <textarea name="description" required rows={2} className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2" />
              </label>
              <button type="submit" className="rounded-full bg-gold py-2.5 text-sm font-semibold uppercase tracking-widest text-ink hover:bg-gold-light sm:col-span-2">
                Save Product
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-ink/50">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="rounded-2xl bg-white/80 p-4 shadow-sm">
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-xl">
                    <Image src={product.imageUrl} alt={product.name} fill sizes="300px" className="object-cover" />
                    {!product.isAvailable && (
                      <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-xs text-cream">Hidden</span>
                    )}
                  </div>
                  <p className="font-display font-semibold text-ink">{product.name}</p>
                  <p className="text-sm text-plum">${product.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <label className="text-ink/60">Stock:</label>
                    <input
                      type="number"
                      defaultValue={product.stockQty}
                      onBlur={(e) => updateStock(product, Number(e.target.value))}
                      className="w-16 rounded border border-ink/15 px-2 py-1"
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => toggleAvailable(product)}
                      className="flex-1 rounded-full border border-ink/20 py-1.5 text-xs uppercase tracking-wide text-ink/70 hover:border-ink"
                    >
                      {product.isAvailable ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="flex-1 rounded-full border border-red-300 py-1.5 text-xs uppercase tracking-wide text-red-500 hover:border-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  placeholder,
  step,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  step?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink/80">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        step={step}
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2"
      />
    </label>
  );
}
