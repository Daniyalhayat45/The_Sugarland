import { PrismaClient, ProductCategory } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

// Placeholder photos via Lorem Picsum (seeded, so they stay consistent between runs).
// Swap these imageUrl values for real product photos whenever you're ready.
const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

const products: {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: ProductCategory;
  servings: string;
  stockQty: number;
}[] = [
  {
    name: "Midnight Gold Drip Cake",
    description:
      "Our signature two-tier dark chocolate cake, wrapped in silky ganache and finished with a cascading gold drip. The same design as our logo — rich, dramatic, and unforgettable.",
    price: 65,
    imageUrl: img("sugarland-signature"),
    category: ProductCategory.SPECIALTY,
    servings: "12-15 people",
    stockQty: 4,
  },
  {
    name: "Classic Vanilla Bean Cake",
    description:
      "Soft vanilla bean sponge layered with vanilla buttercream. Simple, comforting, and always a crowd favorite.",
    price: 32,
    imageUrl: img("sugarland-vanilla"),
    category: ProductCategory.PREMADE,
    servings: "8-10 people",
    stockQty: 10,
  },
  {
    name: "Red Velvet Dream",
    description:
      "Moist red velvet layers with a tangy cream cheese frosting, finished with a dusting of velvet crumbs.",
    price: 38,
    imageUrl: img("sugarland-redvelvet"),
    category: ProductCategory.PREMADE,
    servings: "8-10 people",
    stockQty: 8,
  },
  {
    name: "Salted Caramel Fudge Cake",
    description:
      "Layers of fudgy chocolate cake with a salted caramel core, topped with caramel drip and flaky sea salt.",
    price: 42,
    imageUrl: img("sugarland-caramel"),
    category: ProductCategory.PREMADE,
    servings: "8-10 people",
    stockQty: 6,
  },
  {
    name: "Rosette Buttercream Cake",
    description:
      "A romantic all-over rosette design in blush buttercream, perfect for anniversaries and bridal showers.",
    price: 55,
    imageUrl: img("sugarland-rosette"),
    category: ProductCategory.SPECIALTY,
    servings: "10-12 people",
    stockQty: 3,
  },
  {
    name: "Assorted Cupcake Box (6)",
    description:
      "A mixed box of six mini cupcakes: vanilla, chocolate, red velvet, lemon, salted caramel, and cookies & cream.",
    price: 18,
    imageUrl: img("sugarland-cupcakes"),
    category: ProductCategory.CUPCAKE,
    servings: "6 cupcakes",
    stockQty: 20,
  },
  {
    name: "Chocolate Lava Fondant Cupcakes (4)",
    description: "Warm, gooey molten centers inside a rich dark chocolate cupcake shell.",
    price: 14,
    imageUrl: img("sugarland-lava"),
    category: ProductCategory.CUPCAKE,
    servings: "4 cupcakes",
    stockQty: 15,
  },
  {
    name: "Butter Croissant Box (4)",
    description: "Flaky, buttery, laminated to perfection — baked fresh every morning.",
    price: 12,
    imageUrl: img("sugarland-croissant"),
    category: ProductCategory.PASTRY,
    servings: "4 pieces",
    stockQty: 12,
  },
  {
    name: "Nutella Stuffed Cookies (6)",
    description: "Thick, chewy cookies with a molten Nutella core, dusted with sea salt.",
    price: 15,
    imageUrl: img("sugarland-cookies"),
    category: ProductCategory.PASTRY,
    servings: "6 cookies",
    stockQty: 18,
  },
  {
    name: "Gold Leaf Cheesecake",
    description:
      "Baked New York style cheesecake on a buttery biscuit base, finished with 24k edible gold leaf accents.",
    price: 45,
    imageUrl: img("sugarland-cheesecake"),
    category: ProductCategory.SPECIALTY,
    servings: "8-10 people",
    stockQty: 5,
  },
];

async function main() {
  console.log("Seeding The Sugarland database...");

  await prisma.orderItem.deleteMany();
  await prisma.customCakeRequest.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const created = [];
  for (const p of products) {
    const product = await prisma.product.create({ data: p });
    created.push(product);
  }
  console.log(`Created ${created.length} products.`);

  // A couple of sample orders so the admin dashboard isn't empty on first login.
  const sampleOrder = await prisma.order.create({
    data: {
      trackingCode: `CAKE-${nanoid(6).toUpperCase()}`,
      type: "PREMADE",
      status: "PENDING",
      paymentStatus: "UNPAID",
      customerName: "Ayesha Khan",
      phone: "0300-1234567",
      deliveryAddress: "House 12, Street 4, DHA Phase 5, Karachi",
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      notes: "Please write 'Happy Anniversary' on top in gold.",
      totalEstimate: created[2].price,
      items: {
        create: [{ productId: created[2].id, quantity: 1, price: created[2].price }],
      },
    },
  });

  const customOrder = await prisma.order.create({
    data: {
      trackingCode: `CAKE-${nanoid(6).toUpperCase()}`,
      type: "CUSTOM",
      status: "CONFIRMED",
      paymentStatus: "UNPAID",
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
          designNotes:
            "Dinosaur theme for a 5th birthday. Green and brown tones, small fondant dinosaur figures on top.",
          referenceImageUrl: img("sugarland-custom-ref"),
          budgetRange: "PKR 6,000 - 8,000",
        },
      },
    },
  });

  console.log(`Created sample orders: ${sampleOrder.trackingCode}, ${customOrder.trackingCode}`);
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
