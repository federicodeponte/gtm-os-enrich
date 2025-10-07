"use client";

import { useEffect, useState } from "react";
import { Bot, Zap, DollarSign, Clock, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import type { CSVData, EnrichmentPlanData } from "../enrichment-workflow";

interface EnrichmentPlanMessageProps {
  data: {
    csvData: CSVData;
    userRequest: string;
  };
  onRunSample: (sampleSize: number) => void;
  onRunFull: () => void;
  onRefine?: (feedback: string) => void;
}

export function EnrichmentPlanMessage({
  data,
  onRunSample,
  onRunFull,
  onRefine,
}: EnrichmentPlanMessageProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [plan, setPlan] = useState<EnrichmentPlanData | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sampleSize, setSampleSize] = useState(5);

  useEffect(() => {
    const generatePlan = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockPlan: EnrichmentPlanData = {
        strategy: `I'll use Google Search grounding via Gemini 2.5 Flash to find postal codes.

**Input columns:**
• {{company_name}} - Business name for context
• {{company_address}} - Address to find postal code for

**Prompt template:**
"Find the postal/ZIP code for {{company_name}} located at {{company_address}}. Use Google Search to verify the result and return only the postal code."

**Output:**
• New column: zip - The postal/ZIP code
• New column: confidence - Confidence level (High/Medium/Low)`,
        apiCalls: data.csvData.rows.length,
        estimatedCost: (data.csvData.rows.length * 0.002).toFixed(2),
        estimatedTime: Math.ceil(data.csvData.rows.length / 3 / 60),
        code: "",
      };

      setPlan(mockPlan);
      setIsGenerating(false);
    };

    generatePlan();
  }, [data.csvData.rows.length]);

  if (isGenerating) {
    return (
      <div className="flex gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#0528F2" }}
        >
          <Bot className="w-5 h-5 text-white" />
        </div>

        <div
          className="max-w-[70%] rounded-xl rounded-tl-sm px-4 py-3"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #C4CBF2",
          }}
        >
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#0528F2" }} />
            <p className="text-md" style={{ color: "#626262" }}>
              Creating enrichment plan...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#0528F2" }}
      >
        <Bot className="w-5 h-5 text-white" />
      </div>

      <div
        className="max-w-[70%] rounded-xl rounded-tl-sm px-4 py-3"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #C4CBF2",
        }}
      >
        <div className="text-md mb-4" style={{ color: "#0D0D0D" }}>
          {plan.strategy.split('\n').map((line, idx) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return (
                <p key={idx} className="font-semibold mt-3 mb-1">
                  {line.replace(/\*\*/g, '')}
                </p>
              );
            }
            if (line.startsWith('•')) {
              return (
                <p key={idx} className="ml-2 text-sm" style={{ color: "#626262" }}>
                  {line}
                </p>
              );
            }
            if (line.startsWith('"')) {
              return (
                <p 
                  key={idx} 
                  className="ml-2 text-sm italic px-3 py-2 rounded-md mt-1"
                  style={{ backgroundColor: "#F2F2F2", color: "#0D0D0D" }}
                >
                  {line}
                </p>
              );
            }
            return line ? <p key={idx}>{line}</p> : <br key={idx} />;
          })}
        </div>

        <div
          className="rounded-lg p-4 space-y-3 mb-4"
          style={{ backgroundColor: "#F2F2F2" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: "#626262" }} />
              <span className="text-sm" style={{ color: "#626262" }}>
                API Calls
              </span>
            </div>
            <span className="font-medium text-sm" style={{ color: "#0D0D0D" }}>
              {plan.apiCalls.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" style={{ color: "#626262" }} />
              <span className="text-sm" style={{ color: "#626262" }}>
                Est. Cost
              </span>
            </div>
            <span className="font-medium text-sm" style={{ color: "#0D0D0D" }}>
              ${plan.estimatedCost}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: "#626262" }} />
              <span className="text-sm" style={{ color: "#626262" }}>
                Est. Time
              </span>
            </div>
            <span className="font-medium text-sm" style={{ color: "#0D0D0D" }}>
              ~{plan.estimatedTime} min
            </span>
          </div>
        </div>

        {!showFeedback ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm" style={{ color: "#626262" }}>
                Sample size:
              </label>
              <select
                value={sampleSize}
                onChange={(e) => setSampleSize(Number(e.target.value))}
                className="px-2 py-1 text-sm rounded border"
                style={{ borderColor: "#C4CBF2" }}
              >
                <option value={3}>3 rows</option>
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={25}>25 rows</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => onRunSample(sampleSize)}
                variant="outline"
                size="sm"
                className="flex-1"
                style={{ borderColor: "#C4CBF2" }}
              >
                Test sample
              </Button>
              <Button
                onClick={onRunFull}
                size="sm"
                className="flex-1"
                style={{ backgroundColor: "#0528F2" }}
              >
                Run full enrichment
              </Button>
            </div>

            {onRefine && (
              <Button
                onClick={() => setShowFeedback(true)}
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                style={{ color: "#626262" }}
              >
                Refine plan
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How would you like to refine this plan? (e.g., 'Also add company website', 'Use a different prompt', etc.)"
              className="w-full px-3 py-2 text-sm rounded border resize-none"
              style={{ borderColor: "#C4CBF2", minHeight: "80px" }}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowFeedback(false);
                  setFeedback("");
                }}
                variant="outline"
                size="sm"
                className="flex-1"
                style={{ borderColor: "#C4CBF2" }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (onRefine && feedback.trim()) {
                    onRefine(feedback);
                    setShowFeedback(false);
                    setFeedback("");
                  }
                }}
                size="sm"
                className="flex-1"
                style={{ backgroundColor: "#0528F2" }}
                disabled={!feedback.trim()}
              >
                Submit feedback
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
