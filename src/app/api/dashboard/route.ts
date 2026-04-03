import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/db/dashboard";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
