
import React from 'react';
import { Filter, User, Building, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export interface DateRangeFilter {
  from: Date | undefined;
  to: Date | undefined;
}

export interface Department {
  id: string;
  name: string;
}

export interface CalendarFiltersProps {
  employeeFilter: string;
  departmentFilter: string;
  dateRangeFilter: DateRangeFilter;
  departments: string[];
  onEmployeeFilterChange: (value: string) => void;
  onDepartmentFilterChange: (value: string) => void;
  onDateRangeFilterChange: (dateRange: DateRangeFilter) => void;
  onResetFilters: () => void;
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  employeeFilter,
  departmentFilter,
  dateRangeFilter,
  departments,
  onEmployeeFilterChange,
  onDepartmentFilterChange,
  onDateRangeFilterChange,
  onResetFilters,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px] p-4">
        <DropdownMenuLabel>Filter Vacations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Employee</span>
            </div>
            <Input
              placeholder="Filter by employee name"
              value={employeeFilter}
              onChange={(e) => onEmployeeFilterChange(e.target.value)}
              className="h-8"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Department</span>
            </div>
            <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Date Range</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 text-xs justify-start">
                    {dateRangeFilter.from ? format(dateRangeFilter.from, 'PP') : 'From Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRangeFilter.from}
                    onSelect={(date) => onDateRangeFilterChange({ ...dateRangeFilter, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 text-xs justify-start">
                    {dateRangeFilter.to ? format(dateRangeFilter.to, 'PP') : 'To Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={dateRangeFilter.to}
                    onSelect={(date) => onDateRangeFilterChange({ ...dateRangeFilter, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onResetFilters}
            className="w-full mt-2"
          >
            Reset Filters
          </Button>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
