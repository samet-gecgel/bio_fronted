import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatus } from "@/types/enums/applicationStatus";
import { StatusBadge } from "../StatusBadge";

interface JobHeaderProps {
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
}

export const JobHeader: React.FC<JobHeaderProps> = ({
  jobTitle,
  companyName,
  status,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">{jobTitle}</CardTitle>
            <p className="text-gray-600 text-sm">{companyName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={status} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
