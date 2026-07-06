import { NextRequest, NextResponse } from "next/server";
import { parseDataset, validateDataset } from "@/lib/parser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".txt")) {
      return NextResponse.json(
        { error: "Only .txt files are supported" },
        { status: 400 }
      );
    }

    const content = await file.text();
    const dataset = parseDataset(content, file.name, file.size);
    const errors = validateDataset(dataset);

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validation errors", details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      dataset,
      summary: {
        filename: dataset.filename,
        fileSize: dataset.fileSize,
        totalAttractions: dataset.attractions.length,
        totalRoutes: dataset.routes.length,
        categories: [...new Set(dataset.attractions.map((a) => a.category))],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse dataset";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
