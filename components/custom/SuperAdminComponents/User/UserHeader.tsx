import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { IUser } from "@/types/user";
import { StatusBadge } from "../StatusBadge";

interface UserHeaderProps {
  user: IUser;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  user,
}) => {
  return (
    <CardHeader>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <CardTitle className="text-xl font-bold">Kullanıcı Detayları</CardTitle>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={user.approvalStatus} />
        </div>
      </div>
    </CardHeader>
  );
};
