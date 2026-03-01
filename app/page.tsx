"use client";

import { useMemo, useState } from "react";
import { AdminUploadPanel } from "@/components/AdminUploadPanel";
import { FeatureCard } from "@/components/FeatureCard";
import { AIFeature, Chapter } from "@/lib/types";

const classes = ["6", "7", "8", "9", "10", "11", "12"];
const subjects = ["Math", "Science", "English", "History", "Geography", "Computer"];
const tabs: { key: AIFeature | "doubts"; label: string }[] = [
  { key: "notes", label: "Notes" },
  { key: "flashcards", label: "Flashcards" },
  { key: "quiz", label: "Quiz" },
  { key: "mindmap", label: "Mind Map" },
  { key: "exampaper", label: "Exam Paper" },
  { key: "video", label: "Video Lesson" },
  { key: "revision", label: "Revision Mode" },
  { key: "predictor", label: "Important Questions" },
  { key: "doubts", label: "Doubt Solver" }
];

export default function HomePage() {
  const [schoolClass, setSchoolClass] = useState("10");
  const [subject, setSubject] = useState("Science");
  const [book, setBook] = useState<any>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("notes");
  const [output, setOutput] = useState("Select chapter and generate content.");
  const [doubtBase64, setDoubtBase64] = useState("");

  const featureCards = useMemo(
    () => [
      ["Class Battle Mode", "Compete with classmates and top leaderboards with XP, badges, and rank progression."],
      ["Homework Scanner", "Upload homework photos and receive step-by-step AI solutions."],
      ["Exam Predictor Mode", "AI predicts high-probability exam questions using chapter patterns and learning weight."],
      ["Export & Share", "Export notes to PDF, share with friends, bookmark key questions, and track progress."]
    ],
    []
  );

  async function suggestBook() {
    const res = await fetch(`/api/books?class=${schoolClass}&subject=${subject}`);
    const data = await res.json();
    setBook(data.suggestion ?? null);
    setChapters([]);
    setChapter(null);
    setOutput("Book suggested. Choose YES to load chapters or upload your own book.");
  }

  async function loadChapters() {
    if (!book?.id) return;
    const res = await fetch(`/api/chapters?bookId=${book.id}`);
    const data = await res.json();
    setChapters(data.chapters ?? []);
    setOutput("Chapters loaded. Select one chapter and generate AI material.");
  }

  async function runFeature(feature: AIFeature) {
    if (!chapter) return;
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature, chapterName: chapter.chapterName, chapterText: chapter.chapterText })
    });
    const data = await res.json();
    setOutput(data.content ?? "No output");
  }

  async function solveDoubt() {
    if (!doubtBase64) return;
    const res = await fetch("/api/ai/doubt-solver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image: doubtBase64 })
    });
    const data = await res.json();
    setOutput(data.answer ?? "No answer");
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950 p-6">
        <h1 className="text-3xl font-bold">AI GENIUS – Smart Study Assistant for Students</h1>
        <p className="mt-2 text-slate-300">Full-stack AI platform for notes, quizzes, flashcards, mind maps, exam papers, video lesson scripts, and doubt solving from textbook PDFs stored in Google Drive.</p>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs uppercase text-slate-400">Step 1 — Class</label>
          <select value={schoolClass} onChange={(e) => setSchoolClass(e.target.value)} className="w-full rounded-lg bg-slate-800 p-2">
            {classes.map((cls) => (<option key={cls}>{cls}</option>))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase text-slate-400">Step 2 — Subject</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg bg-slate-800 p-2">
            {subjects.map((item) => (<option key={item}>{item}</option>))}
          </select>
        </div>
        <div className="md:col-span-2 flex items-end gap-3">
          <button onClick={suggestBook} className="rounded-lg bg-brand-500 px-4 py-2 font-semibold hover:bg-brand-700">Find Book</button>
          {book && <button onClick={loadChapters} className="rounded-lg border border-brand-500 px-4 py-2 font-semibold">YES, this is my book</button>}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="font-semibold">Step 3 — Suggested Book</h2>
          <p className="mt-2 text-sm text-slate-300">{book ? `Is this your book? ${book.bookName}` : "No book selected yet."}</p>
          {!book && <p className="mt-2 text-xs text-slate-400">If wrong or missing, upload via Admin/User panel below.</p>}
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:col-span-2">
          <h2 className="font-semibold">Chapter Selector</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {chapters.map((item) => (
              <button key={item.id} onClick={() => setChapter(item)} className={`rounded-full px-3 py-1 text-sm ${chapter?.id === item.id ? "bg-brand-500" : "bg-slate-800"}`}>
                {item.chapterName}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-3 text-xl font-semibold">Study Dashboard</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`rounded-lg px-3 py-1 text-sm ${activeTab === tab.key ? "bg-brand-500" : "bg-slate-800"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== "doubts" ? (
          <button onClick={() => runFeature(activeTab)} disabled={!chapter} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold disabled:opacity-50">
            Generate {activeTab}
          </button>
        ) : (
          <div className="space-y-2">
            <textarea
              className="h-24 w-full rounded-lg bg-slate-800 p-2"
              placeholder="Paste base64 PNG/JPG string of question image"
              value={doubtBase64}
              onChange={(e) => setDoubtBase64(e.target.value)}
            />
            <button onClick={solveDoubt} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold">Solve Doubt</button>
          </div>
        )}

        <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm text-slate-200">{output}</pre>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {featureCards.map(([title, description]) => (
          <FeatureCard key={title} title={title} description={description} />
        ))}
      </section>

      <AdminUploadPanel />
    </main>
  );
}
