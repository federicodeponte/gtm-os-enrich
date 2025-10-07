"use client";

import Link from "next/link";
import { MessageSquare, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            AI Data Enrichment
          </h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Upload your CSV, describe what you need, and let AI do the rest
          </p>
        </header>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Link href="/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Chat Interface</CardTitle>
                <CardDescription>
                  Conversational AI guides you through enrichment step-by-step
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    Natural conversation flow
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    Inline file upload
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    Real-time progress updates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    Best for first-time users
                  </li>
                </ul>
                <Button className="w-full mt-4" style={{ backgroundColor: "#0528F2" }}>
                  Start chatting
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/workflow">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Workflow className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Step-by-Step Workflow</CardTitle>
                <CardDescription>
                  Traditional 6-step process with clear visual progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    Clear step progression
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    Full data preview
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    Detailed plan review
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    Best for power users
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  Start workflow
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}