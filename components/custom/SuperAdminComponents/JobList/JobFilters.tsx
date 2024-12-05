import React from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ApplicationStatus } from "@/types/enums/applicationStatus";
import { Search } from "lucide-react";

interface JobFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedStatus: ApplicationStatus | null;
  setSelectedStatus: (value: ApplicationStatus | null) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div className="relative w-full md:w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="İş ilanı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      <Select
        onValueChange={(value) =>
          setSelectedStatus(value === "Tümü" ? null : parseInt(value) as ApplicationStatus)
        }
        value={selectedStatus !== null ? selectedStatus.toString() : "Tümü"}
      >
                <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Durum Seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Tümü">Tümü</SelectItem>
          <SelectItem value={ApplicationStatus.Pending.toString()}>Beklemede</SelectItem>
          <SelectItem value={ApplicationStatus.Approved.toString()}>Onaylı</SelectItem>
          <SelectItem value={ApplicationStatus.Rejected.toString()}>Reddedildi</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
