import type { ReactNode } from "react";
import { RoleWorkspaceLayout } from "@/components/workspace/role-workspace-layout";

interface BillingLayoutProps {
  children: ReactNode;
}

export default function BillingLayout({ children }: BillingLayoutProps) {
  return (
    <RoleWorkspaceLayout role="Billing Staff">{children}</RoleWorkspaceLayout>
  );
}
