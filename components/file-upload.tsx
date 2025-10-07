"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Upload } from "lucide-react";
import type { CSVData } from "./enrichment-workflow";

interface FileUploadProps {
  onUpload: (data: CSVData) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields || [];
          const rows = results.data as Record<string, string>[];

          onUpload({
            headers,
            rows,
            fileName: file.name,
          });
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          alert("Failed to parse CSV file");
        },
      });
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    maxFiles: 1,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your CSV</CardTitle>
        <CardDescription>
          Drag and drop your CSV file here, or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-colors duration-200
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg text-blue-600">Drop your CSV file here...</p>
          ) : (
            <>
              <p className="text-lg text-slate-600 mb-2">
                Drag & drop your CSV file here
              </p>
              <p className="text-sm text-slate-500">
                or click to select a file from your computer
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

