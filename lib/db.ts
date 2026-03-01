import { Book, Chapter, User } from "./types";

const books: Book[] = [
  {
    id: "book-1",
    class: "10",
    subject: "Science",
    bookName: "Class 10 Science NCERT",
    googleDriveFileId: "sample-drive-file-id-1"
  },
  {
    id: "book-2",
    class: "9",
    subject: "Math",
    bookName: "Class 9 Maths NCERT",
    googleDriveFileId: "sample-drive-file-id-2"
  }
];

const chapters: Chapter[] = [
  {
    id: "chapter-1",
    bookId: "book-1",
    chapterName: "Chemical Reactions and Equations",
    chapterText: "A chemical reaction is a process in which one or more substances are converted into new substances..."
  },
  {
    id: "chapter-2",
    bookId: "book-1",
    chapterName: "Acids, Bases and Salts",
    chapterText: "Acids are sour in taste and turn blue litmus red. Bases turn red litmus blue..."
  }
];

const users: User[] = [];

export const db = {
  getBooks: () => books,
  getBookByFilters: (schoolClass: string, subject: string) =>
    books.find((book) => book.class === schoolClass && book.subject.toLowerCase() === subject.toLowerCase()),
  addBook: (book: Book) => books.push(book),
  getChaptersByBookId: (bookId: string) => chapters.filter((chapter) => chapter.bookId === bookId),
  addChapter: (chapter: Chapter) => chapters.push(chapter),
  addUserUpload: (userId: string, bookId: string) => {
    const existingUser = users.find((user) => user.userId === userId);
    if (existingUser) {
      existingUser.uploadedBooks.push(bookId);
      return;
    }
    users.push({ userId, uploadedBooks: [bookId] });
  }
};
