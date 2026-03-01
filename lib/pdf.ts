import pdf from "pdf-parse";

export async function extractPdfText(fileBuffer: Buffer) {
  const data = await pdf(fileBuffer);
  return data.text;
}

export function splitIntoChapters(text: string) {
  const chapterRegex = /(chapter\s+\d+[:\-.]?\s.*)/gi;
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const chapters: { chapterName: string; chapterText: string }[] = [];

  let currentChapter = "Introduction";
  let buffer: string[] = [];

  for (const line of lines) {
    if (chapterRegex.test(line)) {
      if (buffer.length) {
        chapters.push({ chapterName: currentChapter, chapterText: buffer.join(" ") });
      }
      currentChapter = line;
      buffer = [];
      chapterRegex.lastIndex = 0;
      continue;
    }
    buffer.push(line);
  }

  if (buffer.length) {
    chapters.push({ chapterName: currentChapter, chapterText: buffer.join(" ") });
  }

  return chapters;
}
