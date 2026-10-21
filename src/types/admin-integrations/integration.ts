export type IntegrationStatus = "Connected" | "Disconnected" | "Error";

export interface Integration {
  id: string;
  name: string;
  acronym: string;
  description: string;
  status: IntegrationStatus;
  lastSynced: string;
  recordsSynced: number;
  endpoint: string;
  dataFlow: string;
  lastChecked: string;
  lastMessage: string;
}
