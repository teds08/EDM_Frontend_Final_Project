import type { QualityIssue } from "@/types/admin-data-quality/quality-issue";

export const initialQualityIssues: QualityIssue[] = [
  {
    id: "DQ-001",
    title: "Missing Patient Date of Birth",
    description: "Some patient records do not contain a date of birth.",
    source: "EMR",
    category: "Missing Data",
    severity: "High",
    affectedRecords: 18,
    status: "Open",
    detectedAt: "Oct 22, 2026, 9:25 AM",
    suggestedAction:
      "Verify the patient registration information and complete missing date-of-birth fields.",
    details:
      "The data quality check identified patient records where the date-of-birth field is empty. Missing demographic information may affect patient identification and downstream reporting.",
    sampleRecordIds: ["PT-1048", "PT-1091", "PT-1116"],
  },
  {
    id: "DQ-002",
    title: "Duplicate Laboratory Order IDs",
    description:
      "Multiple laboratory records contain matching order identifiers.",
    source: "LIS",
    category: "Duplicate Records",
    severity: "Critical",
    affectedRecords: 7,
    status: "In Review",
    detectedAt: "Oct 22, 2026, 8:50 AM",
    suggestedAction:
      "Compare the matching laboratory orders and confirm whether duplicate records should be consolidated.",
    details:
      "Matching order identifiers may cause laboratory orders or results to be counted more than once. Records should be reviewed before making changes to the source data.",
    sampleRecordIds: ["LAB-2031", "LAB-2077", "LAB-2094"],
  },
  {
    id: "DQ-003",
    title: "Invalid Billing Amount",
    description:
      "Some billing records contain negative or invalid monetary values.",
    source: "Billing",
    category: "Invalid Format",
    severity: "High",
    affectedRecords: 12,
    status: "Open",
    detectedAt: "Oct 22, 2026, 8:15 AM",
    suggestedAction:
      "Check the affected invoice calculations and confirm the amounts against their corresponding billing records.",
    details:
      "The sample validation process identified monetary values that do not match the expected billing rules. These records require verification before being used in financial summaries.",
    sampleRecordIds: ["INV-3012", "INV-3049", "INV-3080"],
  },
  {
    id: "DQ-004",
    title: "Inconsistent Insurance Member IDs",
    description:
      "Insurance identifiers use inconsistent formats across records.",
    source: "Insurance",
    category: "Inconsistent Data",
    severity: "Medium",
    affectedRecords: 24,
    status: "In Review",
    detectedAt: "Oct 21, 2026, 4:40 PM",
    suggestedAction:
      "Review the insurance identifier format and validate the values against the appropriate source records.",
    details:
      "Differences in identifier formatting can make it harder to match insurance records across systems. Review the formatting rules before applying standardization.",
    sampleRecordIds: ["INS-4012", "INS-4057", "INS-4103"],
  },
  {
    id: "DQ-005",
    title: "Missing Specimen Collection Time",
    description:
      "Some laboratory specimen records lack a collection timestamp.",
    source: "LIS",
    category: "Missing Data",
    severity: "Medium",
    affectedRecords: 9,
    status: "Open",
    detectedAt: "Oct 21, 2026, 2:30 PM",
    suggestedAction:
      "Verify specimen documentation and complete the timestamp where the source record supports it.",
    details:
      "The collection timestamp can be important for laboratory traceability and processing workflows. Missing values should be investigated rather than guessed.",
    sampleRecordIds: ["SP-5022", "SP-5051", "SP-5088"],
  },
  {
    id: "DQ-006",
    title: "Potential Duplicate Patient Records",
    description: "Patient records contain similar identifying attributes.",
    source: "EMR",
    category: "Duplicate Records",
    severity: "High",
    affectedRecords: 5,
    status: "Resolved",
    detectedAt: "Oct 20, 2026, 11:10 AM",
    suggestedAction:
      "Confirm that the suspected records refer to the same patient before applying the approved record-matching procedure.",
    details:
      "The sample issue was reviewed and marked resolved for demonstration. Similar attributes alone are not sufficient evidence to merge patient records.",
    sampleRecordIds: ["PT-1007", "PT-1021"],
  },
  {
    id: "DQ-007",
    title: "Invalid Claim Submission Date",
    description:
      "Some sample insurance claims have dates outside the expected format or range.",
    source: "Insurance",
    category: "Invalid Format",
    severity: "Low",
    affectedRecords: 3,
    status: "Resolved",
    detectedAt: "Oct 19, 2026, 3:35 PM",
    suggestedAction:
      "Validate the date format and compare the submission date with the original claim record.",
    details:
      "The sample issue has been marked resolved. In a real system, the original claim data should be reviewed before changing any date.",
    sampleRecordIds: ["CLM-6018", "CLM-6024"],
  },
  {
    id: "DQ-008",
    title: "Unrecognized Laboratory Test Code",
    description:
      "Some laboratory orders reference codes not found in the expected test list.",
    source: "LIS",
    category: "Inconsistent Data",
    severity: "Critical",
    affectedRecords: 4,
    status: "Open",
    detectedAt: "Oct 22, 2026, 7:55 AM",
    suggestedAction:
      "Compare the codes with the approved laboratory test catalog and verify any required mapping.",
    details:
      "An unmapped test code may prevent consistent interpretation of laboratory orders across systems. Confirm the correct mapping with the approved test catalog.",
    sampleRecordIds: ["LAB-2140", "LAB-2148", "LAB-2153"],
  },
];
