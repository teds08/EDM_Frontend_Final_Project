export type QualitySeverity = "Critical" | "High" | "Medium" | "Low";

export type QualityStatus = "Open" | "In Review" | "Resolved";

export type QualityCategory =
  | "Missing Data"
  | "Duplicate Records"
  | "Invalid Format"
  | "Inconsistent Data";

export interface QualityIssue {
  id: string;
  title: string;
  description: string;
  source: string;
  category: QualityCategory;
  severity: QualitySeverity;
  affectedRecords: number;
  status: QualityStatus;
  detectedAt: string;
  suggestedAction: string;
  details: string;
  sampleRecordIds: string[];
}
