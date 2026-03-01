import { NextResponse } from "next/server";
import { solveDoubtFromImage } from "@/lib/ai";

export async function POST(req: Request) {
  const { base64Image, questionHint } = (await req.json()) as {
    base64Image: string;
    questionHint?: string;
  };

  if (!base64Image) {
    return NextResponse.json({ error: "base64Image is required" }, { status: 400 });
  }

  const result = await solveDoubtFromImage(base64Image, questionHint);
  return NextResponse.json(result);
}
