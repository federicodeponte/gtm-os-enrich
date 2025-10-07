"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { CSVData } from "./enrichment-workflow";

interface DataPreviewProps {
  data: CSVData;
  onNext: () => void;
  onBack: () => void;
}

export function DataPreview({ data, onNext, onBack }: DataPreviewProps) {
  const previewRows = data.rows.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              {data.fileName} • {data.rows.length.toLocaleString()} rows •{" "}
              {data.headers.length} columns
            </CardDescription>
          </div>
          <Badge variant="secondary">{data.rows.length} rows</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-slate-50">
                {data.headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="text-left p-3 text-sm font-semibold text-slate-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b hover:bg-slate-50">
                  {data.headers.map((header, colIdx) => (
                    <td
                      key={colIdx}
                      className="p-3 text-sm text-slate-600 max-w-xs truncate"
                    >
                      {row[header] || (
                        <span className="text-slate-400 italic">empty</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.rows.length > 5 && (
          <p className="text-sm text-slate-500 mt-4 text-center">
            Showing first 5 of {data.rows.length.toLocaleString()} rows
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

