"use client";

import { useState } from "react";
import { FileUpload } from "./file-upload";
import { DataPreview } from "./data-preview";
import { EnrichmentRequest } from "./enrichment-request";
import { EnrichmentPlan } from "./enrichment-plan";
import { SampleResults } from "./sample-results";
import { EnrichmentProgress } from "./enrichment-progress";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type WorkflowStep =
  | "upload"
  | "preview"
  | "request"
  | "plan"
  | "sample"
  | "running"
  | "complete";

export interface CSVData {
  headers: string[];
  rows: Record<string, string>[];
  fileName: string;
}

export interface EnrichmentPlanData {
  strategy: string;
  apiCalls: number;
  estimatedCost: number;
  estimatedTime: number;
  code: string;
}

export interface SampleResultData {
  enrichedRows: Record<string, string>[];
  successRate: number;
}

export function EnrichmentWorkflow() {
  const [step, setStep] = useState<WorkflowStep>("upload");
  const [csvData, setCSVData] = useState<CSVData | null>(null);
  const [userRequest, setUserRequest] = useState("");
  const [plan, setPlan] = useState<EnrichmentPlanData | null>(null);
  const [sampleResults, setSampleResults] = useState<SampleResultData | null>(
    null
  );

  const handleFileUpload = (data: CSVData) => {
    setCSVData(data);
    setStep("preview");
  };

  const handleRequestSubmit = (request: string) => {
    setUserRequest(request);
    setStep("plan");
  };

  const handlePlanGenerated = (planData: EnrichmentPlanData) => {
    setPlan(planData);
  };

  const handleRunSample = () => {
    setStep("sample");
  };

  const handleSampleComplete = (results: SampleResultData) => {
    setSampleResults(results);
  };

  const handleRunFull = () => {
    setStep("running");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={step} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="upload" disabled={step !== "upload"}>
            1. Upload
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            disabled={step !== "preview" && step !== "request"}
          >
            2. Preview
          </TabsTrigger>
          <TabsTrigger value="request" disabled={step !== "request"}>
            3. Request
          </TabsTrigger>
          <TabsTrigger value="plan" disabled={step !== "plan"}>
            4. Plan
          </TabsTrigger>
          <TabsTrigger value="sample" disabled={step !== "sample"}>
            5. Sample
          </TabsTrigger>
          <TabsTrigger
            value="running"
            disabled={step !== "running" && step !== "complete"}
          >
            6. Enrich
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="upload">
            <FileUpload onUpload={handleFileUpload} />
          </TabsContent>

          <TabsContent value="preview">
            {csvData && (
              <DataPreview
                data={csvData}
                onNext={() => setStep("request")}
                onBack={() => setStep("upload")}
              />
            )}
          </TabsContent>

          <TabsContent value="request">
            {csvData && (
              <EnrichmentRequest
                csvData={csvData}
                onSubmit={handleRequestSubmit}
                onBack={() => setStep("preview")}
              />
            )}
          </TabsContent>

          <TabsContent value="plan">
            {csvData && userRequest && (
              <EnrichmentPlan
                csvData={csvData}
                userRequest={userRequest}
                onPlanGenerated={handlePlanGenerated}
                onRunSample={handleRunSample}
                onBack={() => setStep("request")}
              />
            )}
          </TabsContent>

          <TabsContent value="sample">
            {csvData && plan && (
              <SampleResults
                csvData={csvData}
                plan={plan}
                onComplete={handleSampleComplete}
                onRunFull={handleRunFull}
                onBack={() => setStep("plan")}
              />
            )}
          </TabsContent>

          <TabsContent value="running">
            {csvData && plan && (
              <EnrichmentProgress
                csvData={csvData}
                plan={plan}
                onComplete={() => setStep("complete")}
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

