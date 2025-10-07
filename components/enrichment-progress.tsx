"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, CheckCircle2, Download, Clock, Zap } from "lucide-react";
import type { CSVData, EnrichmentPlanData } from "./enrichment-workflow";

interface EnrichmentProgressProps {
  csvData: CSVData;
  plan: EnrichmentPlanData;
  onComplete: () => void;
}

export function EnrichmentProgress({
  csvData,
  plan,
  onComplete,
}: EnrichmentProgressProps) {
  const [progress, setProgress] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [rate, setRate] = useState(0);
  const [eta, setEta] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Mock progressive enrichment
    const total = csvData.rows.length;
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
          setTimeout(() => onComplete(), 0);
        }

        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [csvData.rows.length, onComplete]);

  const handleDownload = () => {
    // Generate enriched CSV with mock data
    const headers = [...csvData.headers, "zip", "confidence"];
    const enrichedRows = csvData.rows.map(row => {
      const zipCodes = ["1010", "1210", "1200", "1170", "1120", "8010", "4020", "6020"];
      return {
        ...row,
        zip: zipCodes[Math.floor(Math.random() * zipCodes.length)],
        confidence: "High"
      };
    });

    // Create CSV content
    const csvLines = [
      headers.join(","),
      ...enrichedRows.map(row => 
        headers.map(h => {
          const value = row[h] || "";
          // Escape values with commas or quotes
          return value.includes(",") || value.includes('"') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(",")
      )
    ];
    
    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "enriched_" + csvData.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              )}
              <CardTitle>
                {isComplete ? "Enrichment Complete!" : "Enriching Data..."}
              </CardTitle>
            </div>
            <CardDescription>
              {isComplete
                ? `Successfully enriched ${csvData.rows.length.toLocaleString()} rows`
                : `Processing ${csvData.rows.length.toLocaleString()} rows with 100 concurrent workers`}
            </CardDescription>
          </div>
          {isComplete && (
            <Badge variant="default" className="bg-green-500">
              Complete
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">
                Progress
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {processed.toLocaleString()} / {csvData.rows.length.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-slate-600 mt-2 text-center">
              {progress.toFixed(1)}% complete
            </p>
          </div>

          {/* Metrics */}
          {!isComplete && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Rate</span>
                </div>
                <p className="text-xl font-bold text-slate-900">
                  {rate.toFixed(1)} rows/sec
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">ETA</span>
                </div>
                <p className="text-xl font-bold text-slate-900">
                  {eta > 60 ? `${(eta / 60).toFixed(1)} min` : `${eta.toFixed(0)} sec`}
                </p>
              </div>
            </div>
          )}

          {/* Log Preview */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Recent Activity
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 h-32 overflow-y-auto font-mono text-xs">
              <div className="text-green-400 space-y-1">
                <div>[{processed - 2}/{csvData.rows.length}] Enriched: {csvData.rows[Math.min(processed - 2, csvData.rows.length - 1)]?.company_name || "Company"}</div>
                <div>[{processed - 1}/{csvData.rows.length}] Enriched: {csvData.rows[Math.min(processed - 1, csvData.rows.length - 1)]?.company_name || "Company"}</div>
                <div className="text-yellow-400">[{processed}/{csvData.rows.length}] Processing...</div>
              </div>
            </div>
          </div>

          {isComplete && (
            <>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  <strong>Success!</strong> Your data has been enriched and is
                  ready to download.
                </AlertDescription>
              </Alert>

              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Download Enriched CSV
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
