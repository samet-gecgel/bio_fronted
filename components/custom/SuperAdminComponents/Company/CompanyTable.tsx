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
import { StatusBadge } from "../StatusBadge";
import { ICompany } from "@/types/company";
import { Edit, Trash2 } from "lucide-react";

interface CompanyTableProps {
  companies: ICompany[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto flex-grow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Şirket Adı</TableHead>
            <TableHead className="w-1/3">Email</TableHead>
            <TableHead className="w-1/6">Durum</TableHead>
            <TableHead className="w-1/6 text-right">Aksiyonlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.companyName}</TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>
                <StatusBadge status={company.approvalStatus} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(company.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(company.id)}
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
