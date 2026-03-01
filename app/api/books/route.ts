import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const schoolClass = searchParams.get("class");
  const subject = searchParams.get("subject");

  if (schoolClass && subject) {
    const suggestion = db.getBookByFilters(schoolClass, subject);
    return NextResponse.json({ suggestion, allBooks: db.getBooks() });
  }

  return NextResponse.json({ books: db.getBooks() });
}
