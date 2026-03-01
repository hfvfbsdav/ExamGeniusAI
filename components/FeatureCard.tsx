"use client";

import { Sparkles } from "lucide-react";

export function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-brand-500">
        <Sparkles size={16} />
        <h3 className="font-semibold text-slate-100">{title}</h3>
      </div>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}
