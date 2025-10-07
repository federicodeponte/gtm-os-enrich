"use client";

import { useEffect, useState } from "react";
import { Bot, Download, CheckCircle2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import type { CSVData } from "../enrichment-workflow";

interface ProgressMessageProps {
  data: {
    csvData: CSVData;
  };
}

export function ProgressMessage({ data }: ProgressMessageProps) {
  const [progress, setProgress] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [rate, setRate] = useState(0);
  const [eta, setEta] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const total = data.csvData.rows.length;
    const startTime = Date.now();

    const interval = setInterval(() => {
      setProcessed((prev) => {
        const next = Math.min(prev + Math.floor(Math.random() * 500) + 100, total);
        const progressPercent = (next / total) * 100;
        setProgress(progressPercent);

        const elapsed = (Date.now() - startTime) / 1000;
        const currentRate = next / elapsed;
        setRate(currentRate);

        const remaining = total - next;
        const etaSeconds = remaining / currentRate;
        setEta(etaSeconds);

        if (next >= total) {
          clearInterval(interval);
          setIsComplete(true);
        }

        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [data.csvData.rows.length]);

  const handleDownload = () => {
    const headers = [...data.csvData.headers, "zip", "confidence"];
    const enrichedRows = data.csvData.rows.map((row) => {
      const zipCodes = ["1010", "1210", "1200", "1170", "1120", "8010", "4020", "6020"];
      return {
        ...row,
        zip: zipCodes[Math.floor(Math.random() * zipCodes.length)],
        confidence: "High",
      };
    });

    const csvLines = [
      headers.join(","),
      ...enrichedRows.map((row) =>
        headers
          .map((h) => {
            const value = row[h] || "";
            return value.includes(",") || value.includes('"')
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
    ];

    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "enriched_" + data.csvData.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        {isComplete ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
              <p className="font-medium text-md" style={{ color: "#0D0D0D" }}>
                Enrichment complete!
              </p>
            </div>

            <p className="text-sm mb-4" style={{ color: "#626262" }}>
              Successfully enriched {data.csvData.rows.length.toLocaleString()} rows.
              Your data is ready to download.
            </p>

            <Button
              onClick={handleDownload}
              className="w-full"
              style={{ backgroundColor: "#0528F2" }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download enriched CSV
            </Button>
          </>
        ) : (
          <>
            <p className="text-md mb-3" style={{ color: "#0D0D0D" }}>
              Enriching {data.csvData.rows.length.toLocaleString()} rows...
            </p>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "#626262" }}>
                  {processed.toLocaleString()} / {data.csvData.rows.length.toLocaleString()}
                </span>
                <span style={{ color: "#626262" }}>{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex justify-between text-xs" style={{ color: "#626262" }}>
              <span>{rate.toFixed(1)} rows/sec</span>
              <span>
                {eta > 60 ? `${(eta / 60).toFixed(1)} min` : `${eta.toFixed(0)} sec`} remaining
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
