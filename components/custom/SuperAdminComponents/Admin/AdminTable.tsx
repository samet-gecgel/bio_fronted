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
import { Edit, Trash2 } from "lucide-react";
import { IAdmin } from "@/types/admin";

interface AdminTableProps {
  admins: IAdmin[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  onEdit,
  onDelete,
}) => {

  return (
    <div className="overflow-x-auto flex-grow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/5">Ad Soyad</TableHead>
            <TableHead className="w-2/5">Email</TableHead>
            <TableHead className="w-1/5 text-right">Aksiyonlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell className="font-medium">{admin.fullName}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => onEdit(admin.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(admin.id)}
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
