import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IJobApplication } from "@/types/jobApplication";

interface JobApplicationsTableProps {
  jobApplications: IJobApplication[];
}

export const JobApplicationsTable: React.FC<JobApplicationsTableProps> = ({
  jobApplications,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/4">İş Başlığı</TableHead>
            <TableHead className="w-1/4">Şirket Adı</TableHead>
            <TableHead className="w-1/4 text-right">Aksiyon</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobApplications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                {application.companyName}
                </TableCell>
              <TableCell>
                {application.jobPostTitle}
                </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(`/super-admin/jobs/edit/${application.jobPostId}`, "_blank")
                  }
                >
                  İş İlanına Git
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
