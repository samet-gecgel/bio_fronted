import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AdminFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const AdminFilters: React.FC<AdminFiltersProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Admin ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
    </div>
  );
};
