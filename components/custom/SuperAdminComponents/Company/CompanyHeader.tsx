import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../StatusBadge";
import { Building2 } from "lucide-react";
import { ICompany } from "@/types/company";

interface CompanyHeaderProps {
  company: ICompany;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  company
}) => {
  return (
    <CardHeader>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="rounded-lg border bg-card p-2">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Şirket Detayları</CardTitle>
            <p className="text-sm text-muted-foreground">{company.companyName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={company.approvalStatus} />
        </div>
      </div>
    </CardHeader>
  );
};
