import React from "react";
import { AtSign, MapPin, Phone, User } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { IUser } from "@/types/user";

interface UserInfoProps {
  user: IUser;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const details = [
    {
      icon: User,
      label: "Ad ve Soyad",
      value: user.fullName,
    },
    {
      icon: AtSign,
      label: "Email",
      value: user.email,
    },
    {
      icon: Phone,
      label: "Telefon",
      value: user.phone,
    },
    {
      icon: MapPin,
      label: "İlçe",
      value: user.district,
    },
    {
      icon: User,
      label: "TC Kimlik",
      value: user.tcKimlik,
    },
    {
      icon: User,
      label: "Doğum Tarihi",
      value: user.birthDate,
    },
  ];

  return (
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map(({ icon: Icon, label, value }, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="rounded-lg border bg-card p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
            <p className="text-sm font-medium leading-none">{label}</p>
            <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
};
