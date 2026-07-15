import { NextResponse } from "next/server";
import { ProductCategory } from "@prisma/client";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

// Protected by middleware.ts (requires an active admin session). Visit
// /api/admin/seed once after your first deploy (while logged into /admin)
// to populate sample products and orders. Safe to call more than once —
// it clears existing products/orders first.
export async function POST() {
  const products: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: ProductCategory;
    servings: string;
    stockQty: number;
  }[] = [
    { name: "Midnight Gold Drip Cake", description: "Our signature two-tier dark chocolate cake, wrapped in silky ganache and finished with a cascading gold drip.", price: 65, imageUrl: img("sugarland-signature"), category: "SPECIALTY", servings: "12-15 people", stockQty: 4 },
    { name: "Classic Vanilla Bean Cake", description: "Soft vanilla bean sponge layered with vanilla buttercream.", price: 32, imageUrl: img("sugarland-vanilla"), category: "PREMADE", servings: "8-10 people", stockQty: 10 },
    { name: "Red Velvet Dream", description: "Moist red velvet layers with a tangy cream cheese frosting.", price: 38, imageUrl: img("sugarland-redvelvet"), category: "PREMADE", servings: "8-10 people", stockQty: 8 },
    { name: "Salted Caramel Fudge Cake", description: "Fudgy chocolate cake with a salted caramel core and drip.", price: 42, imageUrl: img("sugarland-caramel"), category: "PREMADE", servings: "8-10 people", stockQty: 6 },
    { name: "Rosette Buttercream Cake", description: "All-over rosette design in blush buttercream.", price: 55, imageUrl: img("sugarland-rosette"), category: "SPECIALTY", servings: "10-12 people", stockQty: 3 },
    { name: "Assorted Cupcake Box (6)", description: "Six mini cupcakes: vanilla, chocolate, red velvet, lemon, salted caramel, cookies & cream.", price: 18, imageUrl: img("sugarland-cupcakes"), category: "CUPCAKE", servings: "6 cupcakes", stockQty: 20 },
    { name: "Chocolate Lava Fondant Cupcakes (4)", description: "Warm, gooey molten centers inside a dark chocolate shell.", price: 14, imageUrl: img("sugarland-lava"), category: "CUPCAKE", servings: "4 cupcakes", stockQty: 15 },
    { name: "Butter Croissant Box (4)", description: "Flaky, buttery, laminated to perfection.", price: 12, imageUrl: img("sugarland-croissant"), category: "PASTRY", servings: "4 pieces", stockQty: 12 },
    { name: "Nutella Stuffed Cookies (6)", description: "Thick, chewy cookies with a molten Nutella core.", price: 15, imageUrl: img("sugarland-cookies"), category: "PASTRY", servings: "6 cookies", stockQty: 18 },
    { name: "Gold Leaf Cheesecake", description: "Baked New York cheesecake finished with edible gold leaf.", price: 45, imageUrl: img("sugarland-cheesecake"), category: "SPECIALTY", servings: "8-10 people", stockQty: 5 },
  ];

  await prisma.orderItem.deleteMany();
  await prisma.customCakeRequest.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const created = [];
  for (const p of products) {
    created.push(await prisma.product.create({ data: p }));
  }

  await prisma.order.create({
    data: {
      trackingCode: `CAKE-${nanoid(6).toUpperCase()}`,
      type: "PREMADE",
      customerName: "Ayesha Khan",
      phone: "0300-1234567",
      deliveryAddress: "House 12, Street 4, DHA Phase 5, Karachi",
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      notes: "Please write 'Happy Anniversary' on top in gold.",
      totalEstimate: created[2].price,
      items: { create: [{ productId: created[2].id, quantity: 1, price: created[2].price }] },
    },
  });

  await prisma.order.create({
    data: {
      trackingCode: `CAKE-${nanoid(6).toUpperCase()}`,
      type: "CUSTOM",
      status: "CONFIRMED",
      customerName: "Bilal Ahmed",
      phone: "0333-9876543",
      deliveryAddress: "Flat 3B, Clifton Block 2, Karachi",
      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      notes: "Kids birthday theme — dinosaurs if possible.",
      totalEstimate: 70,
      customCake: {
        create: {
          flavor: "Chocolate with Oreo filling",
          size: "10 inch, 2 tier",
          tierCount: 2,
          designNotes: "Dinosaur theme for a 5th birthday. Green and brown tones.",
          referenceImageUrl: img("sugarland-custom-ref"),
          budgetRange: "PKR 6,000 - 8,000",
        },
      },
    },
  });

  return NextResponse.json({ success: true, productsCreated: created.length });
}
