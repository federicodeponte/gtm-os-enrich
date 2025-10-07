"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import { Loader2, CheckCircle2, DollarSign, Clock, Zap, ExternalLink } from "lucide-react";
import type { CSVData, EnrichmentPlanData } from "./enrichment-workflow";

interface EnrichmentPlanProps {
  csvData: CSVData;
  userRequest: string;
  onPlanGenerated: (plan: EnrichmentPlanData) => void;
  onRunSample: (sampleSize: number) => void;
  onBack: () => void;
}

export function EnrichmentPlan({
  csvData,
  userRequest,
  onPlanGenerated,
  onRunSample,
  onBack,
}: EnrichmentPlanProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [plan, setPlan] = useState<EnrichmentPlanData | null>(null);
  const [sampleSize, setSampleSize] = useState(5);
  const [showRefine, setShowRefine] = useState(false);
  const [refineFeedback, setRefineFeedback] = useState("");

  useEffect(() => {
    // Mock AI plan generation
    const generatePlan = async () => {
      setIsGenerating(true);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockPlan: EnrichmentPlanData = {
        strategy: `Use Google Search grounding via Gemini 2.5 Flash API to find postal codes for each company address. The system will:
        
1. Extract company_name and company_address from each row
2. Query Gemini with search grounding enabled
3. Parse and validate the returned ZIP code
4. Add results to a new 'zip' column with confidence notes`,
        apiCalls: csvData.rows.length,
        estimatedCost: (csvData.rows.length * 0.002).toFixed(2),
        estimatedTime: Math.ceil(csvData.rows.length / 3 / 60), // 3 rows/sec
        code: `# Generated enrichment code
import asyncio
from google import genai

async def enrich_row(row):
    client = genai.Client(api_key=API_KEY)
    prompt = f"Find ZIP code for {row['company_name']} at {row['company_address']}"
    result = await client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={"tools": [{"google_search": {}}]}
    )
    return result.zip_code`,
      };

      setPlan(mockPlan);
      onPlanGenerated(mockPlan);
      setIsGenerating(false);
    };

    generatePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <div className="text-center">
              <p className="text-lg font-medium text-slate-900">
                Analyzing your request...
              </p>
              <p className="text-sm text-slate-600 mt-1">
                AI is creating an enrichment strategy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!plan) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <CardTitle>Enrichment Plan Ready</CardTitle>
        </div>
        <CardDescription>
          Review the strategy and estimates before proceeding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">API Calls</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {plan.apiCalls.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">Est. Cost</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                ${plan.estimatedCost}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Est. Time</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                ~{plan.estimatedTime} min
              </p>
            </div>
          </div>

          {/* Strategy */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Strategy
            </h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                {plan.strategy}
              </pre>
            </div>
          </div>

          {/* Generated Code Preview */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Generated Code Preview
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
                {plan.code}
              </pre>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Next step:</strong> Run a sample enrichment to
              verify the results before processing the full dataset.
            </AlertDescription>
          </Alert>

          {!showRefine ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-700">
                  Sample size:
                </label>
                <select
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  className="px-3 py-2 text-sm rounded-md border border-slate-300"
                >
                  <option value={3}>3 rows</option>
                  <option value={5}>5 rows</option>
                  <option value={10}>10 rows</option>
                  <option value={25}>25 rows</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onBack}>
                  Back
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRefine(true)}
                  className="flex-1"
                >
                  Refine Plan
                </Button>
                <Button onClick={() => onRunSample(sampleSize)} className="flex-1">
                  Run Sample ({sampleSize} rows)
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                value={refineFeedback}
                onChange={(e) => setRefineFeedback(e.target.value)}
                placeholder="How would you like to refine this plan? (e.g., 'Also add company website', 'Use a different prompt', etc.)"
                className="min-h-[100px]"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRefine(false);
                    setRefineFeedback("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // In real implementation, this would regenerate the plan
                    alert("Plan refinement would be sent to AI here. For now, this is a mock.");
                    setShowRefine(false);
                    setRefineFeedback("");
                  }}
                  className="flex-1"
                  disabled={!refineFeedback.trim()}
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

