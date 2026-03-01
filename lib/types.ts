export type SchoolClass = "6" | "7" | "8" | "9" | "10" | "11" | "12";

export type Subject = "Math" | "Science" | "English" | "History" | "Geography" | "Computer";

export interface Book {
  id: string;
  class: SchoolClass;
  subject: Subject;
  bookName: string;
  googleDriveFileId: string;
  coverHint?: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  chapterName: string;
  chapterText: string;
}

export interface User {
  userId: string;
  uploadedBooks: string[];
}

export type AIFeature =
  | "notes"
  | "flashcards"
  | "quiz"
  | "mindmap"
  | "exampaper"
  | "video"
  | "revision"
  | "predictor";
