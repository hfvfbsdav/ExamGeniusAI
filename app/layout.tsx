import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI GENIUS – Smart Study Assistant",
  description: "Generate notes, quizzes, flashcards, and exam papers from textbooks."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
