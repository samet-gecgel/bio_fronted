import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  status: "beklemede" | "onaylı" | "reddedildi";
}

interface JobRowProps {
  job: Job;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const JobRow: React.FC<JobRowProps> = ({ job, onEdit, onDelete }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "onaylı":
        return <Badge className="bg-green-500 text-white">Onaylı</Badge>;
      case "reddedildi":
        return <Badge className="bg-red-500 text-white">Reddedildi</Badge>;
      default:
        return <Badge className="bg-yellow-500 text-white">Beklemede</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell>{job.title}</TableCell>
      <TableCell>{job.company}</TableCell>
      <TableCell>{getStatusBadge(job.status)}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => onEdit(job.id)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(job.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
