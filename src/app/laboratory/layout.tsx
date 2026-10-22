import type { ReactNode } from "react";
import { RoleWorkspaceLayout } from "@/components/workspace/role-workspace-layout";

interface LaboratoryLayoutProps {
  children: ReactNode;
}

export default function LaboratoryLayout({ children }: LaboratoryLayoutProps) {
  return (
    <RoleWorkspaceLayout role="Laboratory Staff">
      {children}
    </RoleWorkspaceLayout>
  );
}
