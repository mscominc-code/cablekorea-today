import { NextResponse } from "next/server";
import { plans, carriers } from "@/lib/plans";

export async function GET() {
  return NextResponse.json({ carriers, plans });
}
