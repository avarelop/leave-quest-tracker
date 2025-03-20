
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

interface FilterSectionProps {
  searchTerm: string;
  departmentFilter: string;
  departments: string[];
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onResetFilters: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  departmentFilter,
  departments,
  onSearchChange,
  onDepartmentChange,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by employee name..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full md:w-52">
        <Select
          value={departmentFilter}
          onValueChange={onDepartmentChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button 
        variant="outline" 
        onClick={onResetFilters}
        className="shrink-0"
        disabled={!searchTerm && !departmentFilter}
      >
        Reset Filters
      </Button>
    </div>
  );
};
