import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUser } from "@/types/user";
import { StatusBadge } from "../StatusBadge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface UserTableProps {
  users: IUser[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto flex-grow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Ad Soyad</TableHead>
            <TableHead className="w-1/3">Email</TableHead>
            <TableHead className="w-1/6">Durum</TableHead>
            <TableHead className="w-1/6 text-right">Aksiyonlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <StatusBadge status={user.approvalStatus} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(user.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(user.id)}
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
