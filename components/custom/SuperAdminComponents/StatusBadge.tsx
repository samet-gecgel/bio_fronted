import React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApplicationStatus } from "@/types/enums/applicationStatus";

const statusConfig = {
  [ApplicationStatus.Pending]: {
    icon: AlertCircle,
    text: "Beklemede",
    className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  },
  [ApplicationStatus.Approved]: {
    icon: CheckCircle2,
    text: "Onaylandı",
    className: "bg-green-500/15 text-green-500 border-green-500/20",
  },
  [ApplicationStatus.Rejected]: {
    icon: XCircle,
    text: "Reddedildi",
    className: "bg-red-500/15 text-red-500 border-red-500/20",
  },
};

export const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({
  status,
}) => {
  const { icon: Icon, text, className } = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border",
        className
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{text}</span>
    </div>
  );
};
