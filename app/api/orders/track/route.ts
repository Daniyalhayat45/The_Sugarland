import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { trackingCode, phone } = await req.json();

  if (!trackingCode || !phone) {
    return NextResponse.json({ error: "Missing tracking code or phone." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { trackingCode: String(trackingCode).toUpperCase().trim() },
    include: { items: { include: { product: true } }, customCake: true },
  });

  // Require the phone number to match so guests can't look up someone else's order.
  if (!order || order.phone.replace(/\s+/g, "") !== String(phone).replace(/\s+/g, "")) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({
    trackingCode: order.trackingCode,
    status: order.status,
    deliveryDate: order.deliveryDate,
    deliveryAddress: order.deliveryAddress,
    items: order.items.map((i) => ({ product: { name: i.product.name }, quantity: i.quantity })),
    customCake: order.customCake
      ? { flavor: order.customCake.flavor, size: order.customCake.size }
      : null,
  });
}
