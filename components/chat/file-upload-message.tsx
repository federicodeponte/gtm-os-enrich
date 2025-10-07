"use client";

import { FileText, User } from "lucide-react";
import { Badge } from "../ui/badge";
import type { CSVData } from "../enrichment-workflow";

interface FileUploadMessageProps {
  data: CSVData;
  timestamp: Date;
}

export function FileUploadMessage({ data, timestamp }: FileUploadMessageProps) {
  return (
    <div className="flex gap-3 justify-end">
      <div
        className="max-w-[70%] rounded-xl rounded-tr-sm px-4 py-3"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #C4CBF2",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(5, 40, 242, 0.1)" }}
          >
            <FileText className="w-5 h-5" style={{ color: "#0528F2" }} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-md" style={{ color: "#0D0D0D" }}>
              {data.fileName}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {data.rows.length.toLocaleString()} rows
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {data.headers.length} columns
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-xs mt-2 opacity-60" style={{ color: "#626262" }} suppressHydrationWarning>
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#C4CBF2" }}
      >
        <User className="w-5 h-5" style={{ color: "#0528F2" }} />
      </div>
    </div>
  );
}
