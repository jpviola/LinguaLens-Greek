import { NextRequest, NextResponse } from "next/server";
import { runSession } from "@/lib/orchestrator/runSession";
import { saveSession } from "@/lib/db/sessions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await runSession(body);

    const saved = await saveSession({
      userId: body.userId,
      text: body.text,
      level: body.level,
      goal: body.goal,
      nativeLanguage: body.nativeLanguage,
      context: body.context,
      result,
    });

    return NextResponse.json(
      {
        ...result,
        metadata: {
          ...result.metadata,
          sessionId: saved.id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json(
      { error: message, code: "SESSION_ANALYSIS_FAILED" },
      { status: 500 }
    );
  }
}
