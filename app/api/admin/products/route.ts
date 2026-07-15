import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, price, imageUrl, category, servings, stockQty } = body;

  if (!name || !description || price === undefined || !imageUrl || !category) {
    return NextResponse.json({ error: "Missing required product fields." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      imageUrl,
      category,
      servings: servings || null,
      stockQty: Number(stockQty) || 0,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
