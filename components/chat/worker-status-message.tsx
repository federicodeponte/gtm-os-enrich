"use client";

import { Bot, Activity, CheckCircle2, AlertCircle } from "lucide-react";

interface WorkerStatus {
  id: number;
  status: "idle" | "processing" | "completed" | "error";
  currentRow?: number;
  rowsProcessed: number;
}

interface WorkerStatusMessageProps {
  workers: WorkerStatus[];
  totalRows: number;
  completedRows: number;
}

export function WorkerStatusMessage({
  workers,
  totalRows,
  completedRows,
}: WorkerStatusMessageProps) {
  const activeWorkers = workers.filter((w) => w.status === "processing").length;
  const progress = (completedRows / totalRows) * 100;

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
        <div className="space-y-4">
          <div>
            <p className="font-medium text-md mb-2" style={{ color: "#0D0D0D" }}>
              Processing with {workers.length} async workers
            </p>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#626262" }}>
              <Activity className="w-4 h-4" style={{ color: "#0528F2" }} />
              <span>
                {activeWorkers} active • {completedRows.toLocaleString()} / {totalRows.toLocaleString()} rows
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F2F2F2" }}>
            <div
              className="h-full transition-all duration-300"
              style={{
                backgroundColor: "#0528F2",
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Worker grid */}
          <div className="grid grid-cols-10 gap-1">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="aspect-square rounded flex items-center justify-center text-xs font-medium"
                style={{
                  backgroundColor:
                    worker.status === "processing"
                      ? "#0528F2"
                      : worker.status === "completed"
                      ? "#10B981"
                      : worker.status === "error"
                      ? "#EF4444"
                      : "#E5E7EB",
                  color: worker.status === "idle" ? "#626262" : "#FFFFFF",
                }}
                title={`Worker ${worker.id}: ${worker.status} (${worker.rowsProcessed} rows)`}
              >
                {worker.status === "processing" ? (
                  <Activity className="w-3 h-3 animate-pulse" />
                ) : worker.status === "completed" ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : worker.status === "error" ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  worker.id
                )}
              </div>
            ))}
          </div>

          <div className="text-xs" style={{ color: "#626262" }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#0528F2" }} />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10B981" }} />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#E5E7EB" }} />
                <span>Idle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
