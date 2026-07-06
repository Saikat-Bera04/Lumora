import { NextRequest, NextResponse } from "next/server";
import { optimize } from "@/lib/optimizer";
import type { Dataset, Preferences } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dataset, preferences } = body as {
      dataset: Dataset;
      preferences: Preferences;
    };

    if (!dataset || !preferences) {
      return NextResponse.json(
        { error: "Missing dataset or preferences" },
        { status: 400 }
      );
    }

    if (dataset.attractions.length === 0) {
      return NextResponse.json(
        { error: "Dataset has no attractions" },
        { status: 400 }
      );
    }

    const result = optimize(dataset, preferences);

    return NextResponse.json({
      success: true,
      result,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Optimization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
