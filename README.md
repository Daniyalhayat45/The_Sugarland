# The Sugarland — Online Bakery

A full e-commerce site for The Sugarland bakery: browse and buy premade cakes/cupcakes/pastries,
submit custom cake requests, guest checkout with Cash on Delivery, order tracking by tracking code,
and a full admin dashboard for the owner to manage orders and products.

Built with **Next.js 14 (App Router)**, **Prisma**, and **Neon Postgres**. Designed to deploy for
free on **Vercel**.

## 1. Set up your Neon database

1. Go to https://neon.tech and create a free account/project.
2. In your Neon project dashboard, go to **Connection Details**.
3. Copy the **pooled connection string** — this goes in `DATABASE_URL`.
4. Copy the **direct (non-pooled) connection string** — this goes in `DIRECT_URL`. (Neon shows
   both; the direct one is needed for running migrations.)

## 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

- `DATABASE_URL` / `DIRECT_URL` — from Neon, step 1.
- `JWT_SECRET` — any long random string. Generate one with `openssl rand -base64 32`.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — whatever you want the bakery owner to log in with at `/admin/login`.

## 3. Install, migrate, and seed

```bash
npm install
npx prisma migrate dev --name init   # creates tables in your Neon database
npm run seed                          # adds sample products + 2 sample orders
```

The seed script uses placeholder photos from Lorem Picsum so the site looks populated on day
one. Swap them for real product photos any time from the admin Products page (just paste a new
image URL) or directly in `prisma/seed.ts`.

## 4. Run locally

```bash
npm run dev
```

Visit http://localhost:3000 for the storefront and http://localhost:3000/admin/login for the
owner dashboard.

## Deploying with Vercel only (no local terminal needed)

This project is set up so the database tables get created **automatically during the Vercel
build** — you don't need to run any Prisma commands on your own machine.

1. **Get your code onto GitHub.** Create a new repo at github.com and upload these files (the
   website's "uploading an existing file" option works, or use `git push` if you're comfortable
   with git).
2. **Set up Neon.** Go to neon.tech → create a project → open **Connection Details** → copy the
   **pooled** connection string and the **direct** (non-pooled) one.
3. **Import the repo into Vercel** (vercel.com → Add New Project).
4. **Before deploying**, add these Environment Variables in the Vercel project settings:
   - `DATABASE_URL` — the pooled Neon string
   - `DIRECT_URL` — the direct Neon string
   - `JWT_SECRET` — any long random string
   - `ADMIN_EMAIL` — the email the bakery owner will log in with
   - `ADMIN_PASSWORD` — the password the bakery owner will log in with
5. **Deploy.** Vercel's build runs `prisma generate && prisma migrate deploy && next build` —
   the `migrate deploy` step creates all your tables in Neon automatically using the migration
   already included in `prisma/migrations/`.
6. **Load sample data (optional).** Once deployed, log into `yoursite.vercel.app/admin/login`
   with your `ADMIN_EMAIL`/`ADMIN_PASSWORD`, go to the **Products** tab, and click
   **"Load Sample Data"** — this adds 10 sample products and 2 sample orders so the site isn't
   empty. Safe to click once; skip it if you'd rather add your own products from scratch via
   "+ Add Product".

That's it — no `npx prisma migrate dev`, no local `npm run seed` required for this path.

### Running it locally instead (optional)

If you do want to run it on your own machine too:

```bash
cp .env.example .env   # fill in the same 5 values as above
npm install
npx prisma migrate deploy   # applies the same migration locally
npm run dev
```

## How it's organized

```
app/
  page.tsx                  Homepage (hero, signature cake, featured products)
  shop/                     Product listing + product detail pages
  custom-order/             Custom cake request form
  cart/, checkout/          Guest cart + COD checkout
  order-confirmation/       Order success page with tracking code
  track-order/              Guest order status lookup (tracking code + phone)
  admin/                    Owner dashboard (protected by middleware.ts)
    login/                  Admin sign in
    dashboard/              Orders queue, filters, status/payment updates
    orders/[id]/            Full order detail (custom cake notes, reference image)
    products/                Add/edit/hide/delete products, adjust stock
  api/                      REST API routes backing all of the above
prisma/
  schema.prisma             Data model (Product, Order, OrderItem, CustomCakeRequest)
  seed.ts                   Sample data seeder
lib/
  prisma.ts                 Prisma client singleton
  auth.ts                   Admin JWT session helpers
  cart-context.tsx           Guest cart (stored in the browser, no accounts needed)
components/                 Shared UI (header, footer, product card, drip divider, admin nav)
middleware.ts               Blocks /admin/* and /api/admin/* routes unless logged in
```

## Design notes

The theme mirrors the Sugarland logo: a warm near-black (`#1B1512`) paired with gold
(`#C9A227`) and a deep plum accent (`#5C2A3A`), a brush-script wordmark (Yellowtail) for the
logo, and elegant serif headings (Playfair Display). Sections alternate between the dark and
cream "tiers" like a layered cake, divided by an animated SVG gold drip — the signature visual
element, echoing the drip icing in the logo. Reduced-motion preferences are respected
automatically.

## Payments

This build ships with **Cash on Delivery only**, per your instructions — there's no payment
gateway integrated. If you later want to accept online payments, Stripe isn't available for
Pakistan-based accounts; look at **JazzCash**, **EasyPaisa**, or **Safepay** instead.

## A couple of things worth knowing

- **Guest checkout only** — no customer accounts. Orders are looked up via a tracking code +
  phone number on the Track Order page.
- **Admin login** is a single owner account via `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars — no
  need for a user database for this.
- `npm audit` will flag one remaining high-severity advisory in Next.js 14 that's only fixed by
  upgrading to Next 15/16 (a breaking change). The project works fine on 14; upgrade when you
  have time to test the breaking changes, or ask me to do the upgrade for you.
- Neon's **free tier** is fine to start — it scales to zero when idle and wakes up in about a
  second, which suits a small bakery site's bursty traffic well. No manual "keep-alive" tier
  needed like Aiven's, since Neon's cold start is fast rather than a hard power-off.
