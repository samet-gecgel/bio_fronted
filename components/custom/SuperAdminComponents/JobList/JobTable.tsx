import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IJobPost } from "@/types/jobpost";
import { StatusBadge } from "../StatusBadge";
import { Edit, Trash2 } from "lucide-react";

interface JobTableProps {
  jobs: IJobPost[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const JobTable: React.FC<JobTableProps> = ({ 
  jobs, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Başlık</TableHead>
            <TableHead className="w-1/3">Şirket</TableHead>
            <TableHead className="w-1/6">Durum</TableHead>
            <TableHead className="w-1/6 text-right">Aksiyonlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.companyName}</TableCell>
              <TableCell>
                <StatusBadge status={job.applicationStatus} />
                
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(job.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(job.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
