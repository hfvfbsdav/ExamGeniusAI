# AI GENIUS – Smart Study Assistant for Students

A full-stack AI study platform built with Next.js App Router + Node API routes.

## Core capabilities
- Class/subject/book/chapter selection flow
- AI generators: notes, flashcards, quiz, mind map, exam paper, video lesson, revision mode, important question predictor
- Doubt solver from uploaded image (base64 flow)
- Admin upload flow: PDF -> Google Drive -> PDF text extraction -> chapter detection -> in-memory DB persistence
- Dashboard-ready viral features (class battle mode, homework scanner, exam predictor)
- Dark UI, responsive layout, modular backend services

## Tech stack
- Frontend: Next.js, React, TailwindCSS
- Backend: Next.js route handlers (Node)
- AI: Gemini API via `@google/generative-ai`
- Storage: Google Drive API via `googleapis`
- PDF extraction: `pdf-parse`

## Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Google Drive folders
Designed for:

```text
/AI-Genius-Books
  /class6
  /class7
  /class8
  /class9
  /class10
  /user-books
```

## Database model (target)
- **Books**: `id, class, subject, book_name, google_drive_file_id`
- **Chapters**: `id, book_id, chapter_name, chapter_text`
- **Users**: `user_id, uploaded_books`

Current demo uses an in-memory data layer in `lib/db.ts`. Replace with PostgreSQL/Mongo for production scale.
