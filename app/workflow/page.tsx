"use client";

import { EnrichmentWorkflow } from "@/components/enrichment-workflow";

export default function WorkflowPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            AI Data Enrichment
          </h1>
          <p className="text-slate-600 text-lg">
            Upload your CSV, describe what you need, and let AI do the rest
          </p>
        </header>
        <EnrichmentWorkflow />
      </div>
    </main>
  );
}
