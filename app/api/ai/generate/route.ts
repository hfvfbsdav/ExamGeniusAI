import { NextResponse } from "next/server";
import { generateStudyContent } from "@/lib/ai";
import { AIFeature } from "@/lib/types";

export async function POST(req: Request) {
  const { feature, chapterName, chapterText } = (await req.json()) as {
    feature: AIFeature;
    chapterName: string;
    chapterText: string;
  };

  if (!feature || !chapterName || !chapterText) {
    return NextResponse.json({ error: "feature, chapterName and chapterText are required" }, { status: 400 });
  }

  const result = await generateStudyContent(feature, chapterName, chapterText);
  return NextResponse.json(result);
}
