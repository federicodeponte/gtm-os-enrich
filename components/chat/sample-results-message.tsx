"use client";

import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { CSVData, SampleResultData } from "../enrichment-workflow";

interface SampleResultsMessageProps {
  data: {
    csvData: CSVData;
  };
  onRunFull: () => void;
}

export function SampleResultsMessage({
  data,
  onRunFull,
}: SampleResultsMessageProps) {
  const [isRunning, setIsRunning] = useState(true);
  const [results, setResults] = useState<SampleResultData | null>(null);

  useEffect(() => {
    const runSample = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const sampleRows = data.csvData.rows.slice(0, 5);
      const enrichedRows = sampleRows.map((row) => ({
        ...row,
        zip: ["1010", "1210", "1200", "1170", "1120"][
          Math.floor(Math.random() * 5)
        ],
        confidence: "High",
      }));

      setResults({
        enrichedRows,
        successRate: 100,
      });
      setIsRunning(false);
    };

    runSample();
  }, [data.csvData.rows]);

  if (isRunning) {
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
            <Loader2
              className="w-4 h-4 animate-spin"
              style={{ color: "#0528F2" }}
            />
            <p className="text-md" style={{ color: "#626262" }}>
              Testing on 5 rows...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) return null;

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
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
          <p className="font-medium text-md" style={{ color: "#0D0D0D" }}>
            Sample results look great!
          </p>
        </div>

        <div
          className="rounded-lg p-3 mb-4 space-y-2"
          style={{ backgroundColor: "#F2F2F2" }}
        >
          {results.enrichedRows.slice(0, 3).map((row, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span style={{ color: "#626262" }} className="truncate max-w-[200px]">
                {row.company_name || "Company"}
              </span>
              <Badge
                variant="secondary"
                className="ml-2"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                {row.zip}
              </Badge>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg p-3 mb-4"
          style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
        >
          <p className="text-sm" style={{ color: "#0D0D0D" }}>
            <strong>{results.successRate}% success rate</strong> — Ready to
            process all {data.csvData.rows.length.toLocaleString()} rows?
          </p>
        </div>

        <Button
          onClick={onRunFull}
          className="w-full"
          style={{ backgroundColor: "#0528F2" }}
        >
          Start full enrichment
        </Button>
      </div>
    </div>
  );
}
