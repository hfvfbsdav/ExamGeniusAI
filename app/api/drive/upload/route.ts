import { NextResponse } from "next/server";
import { uploadPdfToDrive } from "@/lib/drive";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const schoolClass = String(formData.get("class") ?? "user-books");

  if (!file) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);
  const uploaded = await uploadPdfToDrive(file.name, fileBuffer, schoolClass);

  return NextResponse.json(uploaded);
}
