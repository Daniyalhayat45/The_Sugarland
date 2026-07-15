import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

function generateTrackingCode() {
  return `CAKE-${nanoid(6).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, customerName, phone, deliveryAddress, deliveryDate, notes } = body;

    if (!customerName || !phone || !deliveryAddress || !deliveryDate) {
      return NextResponse.json({ error: "Missing required delivery details." }, { status: 400 });
    }

    if (type === "CUSTOM") {
      const { customCake } = body;
      if (!customCake?.flavor || !customCake?.size || !customCake?.designNotes || !customCake?.budgetRange) {
        return NextResponse.json({ error: "Missing required custom cake details." }, { status: 400 });
      }

      const order = await prisma.order.create({
        data: {
          trackingCode: generateTrackingCode(),
          type: "CUSTOM",
          customerName,
          phone,
          deliveryAddress,
          deliveryDate: new Date(deliveryDate),
          notes: notes || null,
          totalEstimate: 0,
          customCake: {
            create: {
              flavor: customCake.flavor,
              size: customCake.size,
              tierCount: Number(customCake.tierCount) || 1,
              designNotes: customCake.designNotes,
              referenceImageUrl: customCake.referenceImageUrl || null,
              budgetRange: customCake.budgetRange,
            },
          },
        },
      });

      return NextResponse.json({ trackingCode: order.trackingCode }, { status: 201 });
    }

    // PREMADE cart order
    const { items } = body;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Re-validate prices and stock against the database rather than trusting the client.
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalEstimate = 0;
    const orderItemsData = [];
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product || !product.isAvailable) {
        return NextResponse.json({ error: `A product in your cart is no longer available.` }, { status: 400 });
      }
      const quantity = Math.max(1, Number(item.quantity) || 1);
      totalEstimate += product.price * quantity;
      orderItemsData.push({ productId: product.id, quantity, price: product.price });
    }

    const order = await prisma.order.create({
      data: {
        trackingCode: generateTrackingCode(),
        type: "PREMADE",
        customerName,
        phone,
        deliveryAddress,
        deliveryDate: new Date(deliveryDate),
        notes: notes || null,
        totalEstimate,
        items: { create: orderItemsData },
      },
    });

    return NextResponse.json({ trackingCode: order.trackingCode }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong placing your order." }, { status: 500 });
  }
}
