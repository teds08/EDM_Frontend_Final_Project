"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AuditLog } from "@/types/admin-audit-logs/audit-log";

interface AuditLogDetailsProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  REGISTRATION: "Registration Staff",
  LABORATORY: "Laboratory Staff",
  BILLING: "Billing Staff",
};

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="break-words text-sm font-medium text-slate-800">
        {children}
      </div>
    </div>
  );
}

export function AuditLogDetails({
  log,
  open,
  onOpenChange,
}: AuditLogDetailsProps) {
  if (!log) {
    return null;
  }

  const handleCopyEventId = async () => {
    try {
      await navigator.clipboard.writeText(String(log.id));
    } catch {
      // Clipboard access can be unavailable in some browser contexts.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Audit Log Details
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Review the recorded system activity. Audit records are read-only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-xs text-slate-500">Event ID</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                #{log.id}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyEventId}
              className="cursor-pointer"
            >
              Copy event ID
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DetailItem label="Date and time">
              {formatDateTime(log.createdAt)}
            </DetailItem>

            <DetailItem label="Outcome">
              <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {log.outcome}
              </span>
            </DetailItem>

            <DetailItem label="Actor">{log.actorName}</DetailItem>

            <DetailItem label="Actor role">
              {roleLabels[log.actorRole] ?? log.actorRole}
            </DetailItem>

            <DetailItem label="Actor user ID">{log.actorUserId}</DetailItem>

            <DetailItem label="Action">{log.action}</DetailItem>

            <DetailItem label="Resource type">{log.resourceType}</DetailItem>

            <DetailItem label="Resource ID">{log.resourceId}</DetailItem>
          </div>

          <div className="space-y-2 rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Event details
            </p>
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
              {log.details || "No additional details provided."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
