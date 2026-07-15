import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import DripDivider from "@/components/DripDivider";

export const dynamic = "force-dynamic";

const MARQUEE_ITEMS = [
  "Home-baked in Karachi",
  "Cash on delivery",
  "Hand-decorated",
  "Custom designs welcomed",
  "Order 48 hours ahead",
  "Delivered fresh to your door",
];

const FEATURES = [
  {
    title: "Baked to order",
    body: "Every cake is mixed, baked, and iced the day it's delivered — never sitting on a shelf.",
  },
  {
    title: "Designed with you",
    body: "Tell us the flavor, colors, and story. We sketch, confirm, then decorate by hand.",
  },
  {
    title: "Karachi delivery",
    body: "Pay when it arrives. No cards, no fuss — just cake at your door, on the day you need it.",
  },
];

const TESTIMONIALS = [
  { quote: "The tres leches was unreal. My whole family fought over the last slice.", name: "Ayesha K.", note: "Anniversary cake" },
  { quote: "Turned my rough sketch into the exact cake I imagined. Delivery was on the dot.", name: "Hamza R.", note: "Birthday, DHA" },
  { quote: "Cupcakes looked like tiny artworks. And they still tasted like childhood.", name: "Sara M.", note: "Baby shower" },
];

export default async function HomePage() {
  const [signature, featured] = await Promise.all([
    prisma.product.findFirst({ where: { category: "SPECIALTY" }, orderBy: { createdAt: "asc" } }),
    prisma.product.findMany({ where: { isAvailable: true }, orderBy: { createdAt: "asc" }, take: 4 }),
  ]);

  return (
    <>
      {/* HERO ------------------------------------------------------------- */}
      <section className="ink-bg relative overflow-hidden px-5 pb-24 pt-20 text-center md:pt-28">
        {/* decorative corner scrolls */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-plum/25 blur-3xl" />
        </div>

        <div className="relative">
          <p className="eyebrow left mx-auto justify-center">
            <span>Home-baked in Karachi · Est. 2024</span>
          </p>
          <h1 className="mt-6 font-script text-shimmer inline-block text-6xl leading-[0.9] md:text-[8.5rem]">
            The Sugarland
          </h1>
          <p className="mx-auto mt-2 font-display text-base italic tracking-wide text-gold/80 md:text-lg">
            — a mouthful treat for everyone —
          </p>
          <p className="mx-auto mt-8 max-w-xl font-body text-base leading-relaxed text-cream/75 md:text-lg">
            Custom cakes, cupcakes, and pastries. Mixed by hand, iced with care,
            and delivered fresh to your door across Karachi.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-gold px-9 py-3.5 font-body text-xs font-bold uppercase tracking-[0.28em] text-ink shadow-[0_10px_30px_-10px_rgba(201,162,39,0.7)] transition hover:bg-gold-light hover:shadow-[0_14px_40px_-10px_rgba(241,217,139,0.9)]"
            >
              Shop the menu
            </Link>
            <Link
              href="/custom-order"
              className="rounded-full border border-gold/60 px-9 py-3.5 font-body text-xs font-bold uppercase tracking-[0.28em] text-cream transition hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              Design a custom cake
            </Link>
          </div>

          {/* trust chips */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.32em] text-cream/60">
            <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold" /> Fresh daily</span>
            <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold" /> Cash on delivery</span>
            <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold" /> Hand-decorated</span>
          </div>
        </div>
      </section>

      {/* Marquee ribbon ---------------------------------------------------- */}
      <div className="marquee">
        <div className="marquee__track font-body text-[11px] uppercase tracking-[0.4em] text-gold/85">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              {item}
              <span aria-hidden className="text-gold/50">✦</span>
            </span>
          ))}
        </div>
      </div>

      <DripDivider fill="#1B1512" />

      {/* Features strip ---------------------------------------------------- */}
      <section className="quilted-bg px-5 pt-16 pb-6">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="relative rounded-2xl border border-gold/30 bg-white/60 p-6 backdrop-blur-sm"
            >
              <span className="absolute -top-3 left-6 rounded-full bg-ink px-3 py-1 font-body text-[10px] uppercase tracking-[0.3em] text-gold">
                0{i + 1}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signature ---------------------------------------------------------- */}
      <section className="quilted-bg px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          {signature && (
            <>
              <div className="relative">
                <div className="animate-rise-in relative aspect-square overflow-hidden rounded-[2rem] border border-gold/40 shadow-[0_40px_80px_-30px_rgba(27,21,18,0.5)]">
                  <Image src={signature.imageUrl} alt={signature.name} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
                </div>
                {/* floating price tag */}
                <div className="absolute -right-3 -top-3 rotate-3 rounded-2xl bg-ink px-5 py-3 shadow-xl">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80">From</p>
                  <p className="font-display text-2xl font-semibold text-cream">${signature.price.toFixed(2)}</p>
                </div>
                {/* signature ribbon */}
                <div className="absolute -left-4 bottom-8 -rotate-6 rounded-full bg-plum px-4 py-1.5 font-script text-xl text-cream shadow-lg">
                  the signature
                </div>
              </div>
              <div>
                <span className="eyebrow left"><span>Our signature slice</span></span>
                <h2 className="gold-underline left mt-4 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
                  {signature.name}
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">{signature.description}</p>

                <ul className="mt-6 grid max-w-md grid-cols-2 gap-y-2 text-sm text-ink/75">
                  <li className="flex items-center gap-2"><span className="text-gold">✦</span> Made-to-order</li>
                  <li className="flex items-center gap-2"><span className="text-gold">✦</span> Serves 8–10</li>
                  <li className="flex items-center gap-2"><span className="text-gold">✦</span> Hand-piped</li>
                  <li className="flex items-center gap-2"><span className="text-gold">✦</span> 48h notice</li>
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/shop/${signature.id}`}
                    className="rounded-full bg-ink px-7 py-3 font-body text-xs font-bold uppercase tracking-[0.28em] text-cream transition hover:bg-plum"
                  >
                    View this cake
                  </Link>
                  <Link
                    href="/custom-order"
                    className="font-body text-xs uppercase tracking-[0.28em] text-plum underline-offset-4 hover:underline"
                  >
                    Or design your own →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured grid ----------------------------------------------------- */}
      <section className="quilted-bg px-5 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col items-center text-center">
            <span className="eyebrow"><span>This week</span></span>
            <h2 className="gold-underline mt-4 font-display text-3xl font-bold text-ink md:text-4xl">
              Fresh from the oven
            </h2>
            <p className="mt-4 max-w-md text-sm text-ink/60">
              A rotating selection of premade favorites — ready to order, decorated the morning they leave the kitchen.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 rounded-full border border-ink/25 bg-white/70 px-8 py-3 font-body text-xs font-bold uppercase tracking-[0.28em] text-ink transition hover:border-plum hover:text-plum"
            >
              Browse the full menu <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials ------------------------------------------------------ */}
      <section className="quilted-bg border-t border-gold/25 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="eyebrow"><span>Kind words</span></span>
            <h2 className="gold-underline mt-4 font-display text-3xl font-bold text-ink md:text-4xl">
              What our people say
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="frame-gold rounded-2xl p-7">
                <div className="font-script text-5xl leading-none text-gold">“</div>
                <blockquote className="mt-2 font-display text-base italic leading-relaxed text-ink/85">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between border-t border-gold/25 pt-4">
                  <span className="font-display font-semibold text-ink">{t.name}</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-plum/80">{t.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <DripDivider fill="#1B1512" flip />

      {/* Custom order CTA -------------------------------------------------- */}
      <section className="ink-bg relative overflow-hidden px-5 py-24 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <span className="eyebrow"><span>Custom orders</span></span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-cream md:text-5xl">
            Got something specific <span className="font-script text-shimmer">in mind?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-cream/75">
            Tell us the flavor, size, and design you're dreaming of. We'll call you to confirm
            every detail before your cake goes in the oven.
          </p>
          <Link
            href="/custom-order"
            className="mt-10 inline-block rounded-full bg-gold px-10 py-4 font-body text-xs font-bold uppercase tracking-[0.28em] text-ink shadow-[0_10px_30px_-10px_rgba(201,162,39,0.8)] transition hover:bg-gold-light"
          >
            Start your custom order
          </Link>
          <p className="mt-6 text-[11px] uppercase tracking-[0.35em] text-cream/40">
            Response within 24 hours · Karachi only
          </p>
        </div>
      </section>
    </>
  );
}
