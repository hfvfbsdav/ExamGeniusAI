import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extractPdfText, splitIntoChapters } from "@/lib/pdf";
import { uploadPdfToDrive } from "@/lib/drive";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const schoolClass = String(formData.get("class") ?? "10");
  const subject = String(formData.get("subject") ?? "Science");
  const bookName = String(formData.get("bookName") ?? file?.name ?? "Uploaded Book");
  const userId = String(formData.get("userId") ?? "admin");

  if (!file) {
    return NextResponse.json({ error: "PDF file required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const driveUpload = await uploadPdfToDrive(file.name, buffer, schoolClass);
  const fullText = await extractPdfText(buffer);
  const parsedChapters = splitIntoChapters(fullText).slice(0, 25);

  const bookId = `book-${Date.now()}`;
  db.addBook({
    id: bookId,
    class: schoolClass as "6",
    subject: subject as "Science",
    bookName,
    googleDriveFileId: driveUpload.fileId
  });

  parsedChapters.forEach((chapter, index) => {
    db.addChapter({
      id: `${bookId}-chapter-${index + 1}`,
      bookId,
      chapterName: chapter.chapterName,
      chapterText: chapter.chapterText
    });
  });

  db.addUserUpload(userId, bookId);

  return NextResponse.json({
    message: "Book uploaded and processed.",
    driveUpload,
    bookId,
    chaptersCreated: parsedChapters.length
  });
}
