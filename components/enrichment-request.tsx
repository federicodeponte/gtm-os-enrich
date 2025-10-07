"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Sparkles } from "lucide-react";
import type { CSVData } from "./enrichment-workflow";

interface EnrichmentRequestProps {
  csvData: CSVData;
  onSubmit: (request: string) => void;
  onBack: () => void;
}

const EXAMPLE_REQUESTS = [
  "Add ZIP codes based on company address",
  "Find company email addresses",
  "Enrich with company industry and size",
  "Add phone numbers from company name and location",
];

export function EnrichmentRequest({
  csvData,
  onSubmit,
  onBack,
}: EnrichmentRequestProps) {
  const [request, setRequest] = useState("");

  const handleSubmit = () => {
    if (!request.trim()) {
      alert("Please describe what you'd like to enrich");
      return;
    }
    onSubmit(request);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          What would you like to enrich?
        </CardTitle>
        <CardDescription>
          Describe in natural language what data you want to add to your CSV
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Your Request
            </label>
            <Textarea
              placeholder="Example: Add ZIP codes based on company address using Google Search"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Example Requests
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_REQUESTS.map((example, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-slate-100"
                  onClick={() => setRequest(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> Be specific about:
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4 list-disc">
              <li>Which columns to use as input</li>
              <li>What data you want to add</li>
              <li>Any specific data sources or APIs to use</li>
            </ul>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={!request.trim()}>
              Generate Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

