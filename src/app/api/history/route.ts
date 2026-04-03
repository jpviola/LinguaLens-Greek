import { NextResponse } from "next/server";
import { listRecentSessions } from "@/lib/db/sessions";

export async function GET() {
  try {
    const items = await listRecentSessions(10);
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json(
      { error: message, code: "HISTORY_FETCH_FAILED" },
      { status: 500 }
    );
  }
}
