import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status && status !== "ALL" ? { status: status as any } : {},
    include: { items: { include: { product: true } }, customCake: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
