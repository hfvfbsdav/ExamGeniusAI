import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIFeature } from "./types";

const promptTemplates: Record<AIFeature, string> = {
  notes: "Create simplified student-friendly notes with key concepts, bullet summaries, formulas, definitions, and diagram explanations.",
  flashcards: "Generate revision flashcards in Front: Question / Back: Answer format and include revision tips.",
  quiz: "Generate an assessment with MCQs, short answers, and true/false. Provide answer key and explanations.",
  mindmap: "Create a hierarchical mind map style breakdown with chapter -> ideas -> subtopics -> formulas.",
  exampaper: "Generate a complete exam paper with Section A (1 mark), Section B (2 marks), Section C (5 marks), Section D (long answers).",
  video: "Generate a video lesson script, slide outline, and teacher-style explanation.",
  revision: "Summarize chapter into a strict 5-minute revision format.",
  predictor: "Predict most likely exam questions and explain why they are high priority."
};

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";

export async function generateStudyContent(feature: AIFeature, chapterName: string, chapterText: string) {
  if (!apiKey) {
    return {
      content: `[Mock ${feature}] ${chapterName}\n\n${promptTemplates[feature]}\n\n${chapterText.slice(0, 2000)}`,
      source: "mock"
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const prompt = `You are AI GENIUS, a smart school tutor.\nFeature: ${feature}\nInstruction: ${promptTemplates[feature]}\nChapter: ${chapterName}\nText:\n${chapterText}`;

  const result = await model.generateContent(prompt);
  const content = result.response.text();

  return { content, source: "gemini" };
}

export async function solveDoubtFromImage(base64Image: string, questionHint?: string) {
  if (!apiKey) {
    return {
      answer: "Mock doubt solution: Read the question, identify known values, apply the suitable formula/theorem, then solve step-by-step.",
      source: "mock"
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const response = await model.generateContent([
    {
      inlineData: {
        data: base64Image,
        mimeType: "image/png"
      }
    },
    {
      text: `Solve this student doubt step-by-step in easy language. Hint: ${questionHint ?? "N/A"}`
    }
  ]);

  return { answer: response.response.text(), source: "gemini" };
}
