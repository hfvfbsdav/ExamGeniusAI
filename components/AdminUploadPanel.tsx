"use client";

import { useState } from "react";

export function AdminUploadPanel() {
  const [message, setMessage] = useState("Idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setMessage("Uploading and processing...");

    const res = await fetch("/api/admin/upload-book", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setMessage(data.error ?? `${data.message} Chapters: ${data.chaptersCreated}`);
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="mb-3 text-lg font-semibold">Admin Dashboard: Upload Books/Syllabus</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <input name="bookName" placeholder="Book name" className="rounded-lg bg-slate-800 px-3 py-2" required />
        <input name="subject" placeholder="Subject" className="rounded-lg bg-slate-800 px-3 py-2" required />
        <input name="class" placeholder="Class (6-12)" className="rounded-lg bg-slate-800 px-3 py-2" required />
        <input name="userId" placeholder="Admin/User ID" className="rounded-lg bg-slate-800 px-3 py-2" defaultValue="admin" />
        <input name="file" type="file" accept="application/pdf" className="rounded-lg bg-slate-800 px-3 py-2 md:col-span-2" required />
        <button className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-700 md:col-span-2">Upload to Google Drive + Process</button>
      </form>
      <p className="mt-3 text-sm text-slate-300">{message}</p>
    </section>
  );
}
