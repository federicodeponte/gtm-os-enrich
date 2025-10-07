"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { CSVData, EnrichmentPlanData, SampleResultData } from "./enrichment-workflow";

interface SampleResultsProps {
  csvData: CSVData;
  plan: EnrichmentPlanData;
  onComplete: (results: SampleResultData) => void;
  onRunFull: () => void;
  onBack: () => void;
}

export function SampleResults({
  csvData,
  plan,
  onComplete,
  onRunFull,
  onBack,
}: SampleResultsProps) {
  const [isRunning, setIsRunning] = useState(true);
  const [results, setResults] = useState<SampleResultData | null>(null);

  useEffect(() => {
    // Mock sample enrichment
    const runSample = async () => {
      setIsRunning(true);
      
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const sampleRows = csvData.rows.slice(0, 5);
      const enrichedRows = sampleRows.map((row) => ({
        ...row,
        zip: ["1010", "1210", "1200", "1170", "1120"][Math.floor(Math.random() * 5)],
        confidence: ["High", "High", "Medium", "High", "High"][Math.floor(Math.random() * 5)],
      }));

      const mockResults: SampleResultData = {
        enrichedRows,
        successRate: 100,
      };

      setResults(mockResults);
      onComplete(mockResults);
      setIsRunning(false);
    };

    runSample();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isRunning) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <div className="text-center">
              <p className="text-lg font-medium text-slate-900">
                Running sample enrichment...
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Processing 5 rows to verify results
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <CardTitle>Sample Results</CardTitle>
            </div>
            <CardDescription>
              5 rows enriched • {results.successRate}% success rate
            </CardDescription>
          </div>
          <Badge variant="default" className="bg-green-500">
            {results.successRate}% Success
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-slate-50">
                  {Object.keys(results.enrichedRows[0]).map((header, idx) => (
                    <th
                      key={idx}
                      className="text-left p-3 text-sm font-semibold text-slate-700"
                    >
                      {header}
                      {["zip", "confidence"].includes(header) && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          NEW
                        </Badge>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.enrichedRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b hover:bg-slate-50">
                    {Object.entries(row).map(([key, value], colIdx) => (
                      <td
                        key={colIdx}
                        className={`p-3 text-sm max-w-xs truncate ${
                          ["zip", "confidence"].includes(key)
                            ? "font-semibold text-green-700 bg-green-50"
                            : "text-slate-600"
                        }`}
                      >
                        {value || (
                          <span className="text-slate-400 italic">empty</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Success Alert */}
          {results.successRate >= 80 ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900">
                <strong>Great results!</strong> The enrichment is working well.
                Ready to process all {csvData.rows.length.toLocaleString()} rows?
              </AlertDescription>
            </Alert>
          ) : results.successRate >= 50 ? (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-900">
                <strong>Partial success.</strong> Some rows couldn't be enriched.
                You can proceed or adjust your request.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                <strong>Low success rate.</strong> Consider adjusting your
                enrichment request or data format.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Adjust Plan
            </Button>
            <Button
              onClick={onRunFull}
              className="flex-1"
              disabled={results.successRate < 50}
            >
              Run Full Enrichment ({csvData.rows.length.toLocaleString()} rows)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
