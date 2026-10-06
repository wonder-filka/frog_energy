import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const userId = await getSessionUserId();
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  // Only the buyer can see their order's status
  if (!order || order.userId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ status: order.status });
}
