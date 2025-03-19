
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestData } from '../dashboard/RequestCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DayProps } from 'react-day-picker';
import { Filter, User, Users, Calendar as CalendarIcon, Building } from 'lucide-react';
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

interface VacationCalendarProps {
  requests: RequestData[];
  isManager?: boolean;
  className?: string;
  calendarClassName?: string;
}

// Define departments for demo purposes
const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations'
];

// For demo purposes, assign departments to employees
const employeeDepartments: Record<string, string> = {
  '101': 'Engineering',
  '102': 'Marketing',
  '103': 'Sales',
  '104': 'HR',
  '105': 'Engineering',
};

export const VacationCalendar: React.FC<VacationCalendarProps> = ({ 
  requests,
  isManager = false,
  className,
  calendarClassName
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [employeeFilter, setEmployeeFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [dateRangeFilter, setDateRangeFilter] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });

  // Apply filters to requests
  const filteredRequests = React.useMemo(() => {
    return requests.filter(request => {
      // Only show approved requests in the calendar
      if (request.status !== 'approved') return false;
      
      // Employee filter
      if (employeeFilter && !request.employee.name.toLowerCase().includes(employeeFilter.toLowerCase())) {
        return false;
      }
      
      // Department filter
      if (departmentFilter && employeeDepartments[request.employee.id] !== departmentFilter) {
        return false;
      }
      
      // Date range filter
      if (dateRangeFilter.from && dateRangeFilter.to) {
        const requestStart = new Date(request.startDate);
        const requestEnd = new Date(request.endDate);
        
        // Check if the vacation period overlaps with the filter range
        if (requestEnd < dateRangeFilter.from || requestStart > dateRangeFilter.to) {
          return false;
        }
      }
      
      return true;
    });
  }, [requests, employeeFilter, departmentFilter, dateRangeFilter]);

  // Find all dates that have vacation requests
  const vacationDates = React.useMemo(() => {
    const dates: Record<string, RequestData[]> = {};
    
    filteredRequests.forEach(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      
      for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        const dateStr = format(day, 'yyyy-MM-dd');
        if (!dates[dateStr]) {
          dates[dateStr] = [];
        }
        dates[dateStr].push(request);
      }
    });
    
    return dates;
  }, [filteredRequests]);

  // Get unique employees from all requests
  const employees = React.useMemo(() => {
    const uniqueEmployees = new Map();
    requests.forEach(request => {
      if (!uniqueEmployees.has(request.employee.id)) {
        uniqueEmployees.set(request.employee.id, request.employee.name);
      }
    });
    return Array.from(uniqueEmployees).map(([id, name]) => ({ id, name }));
  }, [requests]);

  const dayHasVacation = (day: Date) => {
    return !!vacationDates[format(day, 'yyyy-MM-dd')];
  };

  const getVacationsForDay = (day: Date) => {
    return vacationDates[format(day, 'yyyy-MM-dd')] || [];
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  const resetFilters = () => {
    setEmployeeFilter('');
    setDepartmentFilter('');
    setDateRangeFilter({
      from: undefined,
      to: undefined
    });
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Vacation Calendar</CardTitle>
        {isManager && (
          <div className="flex items-center space-x-2">
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
                      onChange={(e) => setEmployeeFilter(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      <span className="text-sm font-medium">Department</span>
                    </div>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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
                            onSelect={(date) => setDateRangeFilter(prev => ({ ...prev, from: date }))}
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
                            onSelect={(date) => setDateRangeFilter(prev => ({ ...prev, to: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={resetFilters}
                    className="w-full mt-2"
                  >
                    Reset Filters
                  </Button>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isManager && (
          <div className="mb-4 flex flex-wrap gap-2">
            {employeeFilter && (
              <div className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs flex items-center">
                <User className="mr-1 h-3 w-3" />
                <span>Employee: {employeeFilter}</span>
                <button 
                  className="ml-2 hover:bg-secondary-foreground/20 rounded-full"
                  onClick={() => setEmployeeFilter('')}
                >
                  <span className="sr-only">Remove</span>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                    <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor"></path>
                  </svg>
                </button>
              </div>
            )}
            
            {departmentFilter && (
              <div className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs flex items-center">
                <Building className="mr-1 h-3 w-3" />
                <span>Department: {departmentFilter}</span>
                <button 
                  className="ml-2 hover:bg-secondary-foreground/20 rounded-full"
                  onClick={() => setDepartmentFilter('')}
                >
                  <span className="sr-only">Remove</span>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                    <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor"></path>
                  </svg>
                </button>
              </div>
            )}
            
            {(dateRangeFilter.from || dateRangeFilter.to) && (
              <div className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <span>
                  Dates: {dateRangeFilter.from ? format(dateRangeFilter.from, 'PP') : 'Any'} 
                  {' — '} 
                  {dateRangeFilter.to ? format(dateRangeFilter.to, 'PP') : 'Any'}
                </span>
                <button 
                  className="ml-2 hover:bg-secondary-foreground/20 rounded-full"
                  onClick={() => setDateRangeFilter({ from: undefined, to: undefined })}
                >
                  <span className="sr-only">Remove</span>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                    <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          onDayClick={handleDayClick}
          className={cn("rounded-md p-3 pointer-events-auto mx-auto", calendarClassName)}
          modifiers={{
            hasVacation: Object.keys(vacationDates).map(dateStr => new Date(dateStr)),
          }}
          modifiersClassNames={{
            hasVacation: "bg-primary/10 text-primary font-medium",
          }}
          components={{
            Day: ({ date, ...props }: DayProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
              // The date property contains the actual day being rendered
              const vacations = getVacationsForDay(date);
              const hasVacations = vacations.length > 0;
              
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      {...props}
                      className={cn(
                        "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                        hasVacations && "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                      )}
                    >
                      {format(date, "d")}
                    </button>
                  </PopoverTrigger>
                  {hasVacations && (
                    <PopoverContent className="w-80 p-0" align="center">
                      <div className="p-4">
                        <h3 className="font-medium">
                          {format(date, "MMMM d, yyyy")}
                        </h3>
                        <div className="mt-2 space-y-2">
                          {vacations.map((vacation, index) => (
                            <div 
                              key={index} 
                              className="text-sm p-2 bg-secondary rounded-md"
                            >
                              <div className="font-medium">
                                {vacation.employee.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center justify-between">
                                <span>{format(vacation.startDate, "MMM d")} - {format(vacation.endDate, "MMM d, yyyy")}</span>
                                {employeeDepartments[vacation.employee.id] && (
                                  <span className="bg-secondary-foreground/10 px-2 py-0.5 rounded-full text-[10px]">
                                    {employeeDepartments[vacation.employee.id]}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  )}
                </Popover>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
};
