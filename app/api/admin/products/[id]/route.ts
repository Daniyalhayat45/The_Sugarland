import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data: Record<string, unknown> = {};

  for (const key of ["name", "description", "imageUrl", "category", "servings"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.stockQty !== undefined) data.stockQty = Number(body.stockQty);
  if (body.isAvailable !== undefined) data.isAvailable = Boolean(body.isAvailable);

  try {
    const product = await prisma.product.update({ where: { id: params.id }, data });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
}
