import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Use POST /api/optimize to generate a summary",
    usage: "The summary is included in the optimization response",
  });
}
