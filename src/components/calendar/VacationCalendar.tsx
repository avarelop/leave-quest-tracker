
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestData } from '../dashboard/RequestCard';
import { cn } from '@/lib/utils';
import { DayProps } from 'react-day-picker';
import { CalendarFilters, DateRangeFilter } from './CalendarFilters';
import { ActiveFilterTags } from './ActiveFilterTags';
import { VacationDayContent } from './VacationDayContent';
import { useVacationData } from '@/hooks/useVacationData';

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
  const [employeeFilter, setEmployeeFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>({
    from: undefined,
    to: undefined
  });

  // Use our custom hook to process vacation data
  const { getVacationsForDay } = useVacationData({
    requests,
    employeeFilter,
    departmentFilter,
    dateRangeFilter,
    employeeDepartments
  });

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

  // Handler for date range filter changes
  const handleDateRangeFilterChange = (newDateRange: DateRangeFilter) => {
    setDateRangeFilter(newDateRange);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Vacation Calendar</CardTitle>
        {isManager && (
          <div className="flex items-center space-x-2">
            <CalendarFilters
              employeeFilter={employeeFilter}
              departmentFilter={departmentFilter}
              dateRangeFilter={dateRangeFilter}
              departments={departments}
              onEmployeeFilterChange={setEmployeeFilter}
              onDepartmentFilterChange={setDepartmentFilter}
              onDateRangeFilterChange={handleDateRangeFilterChange}
              onResetFilters={resetFilters}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isManager && (
          <div className="mb-4">
            <ActiveFilterTags
              employeeFilter={employeeFilter}
              departmentFilter={departmentFilter}
              dateRangeFilter={dateRangeFilter}
              onRemoveEmployeeFilter={() => setEmployeeFilter('')}
              onRemoveDepartmentFilter={() => setDepartmentFilter('')}
              onRemoveDateRangeFilter={() => setDateRangeFilter({ from: undefined, to: undefined })}
            />
          </div>
        )}

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          onDayClick={handleDayClick}
          className={cn("rounded-md p-3 pointer-events-auto mx-auto", calendarClassName)}
          modifiers={{
            hasVacation: Object.keys(useVacationData({
              requests,
              employeeFilter,
              departmentFilter,
              dateRangeFilter,
              employeeDepartments
            }).vacationDates).map(dateStr => new Date(dateStr)),
          }}
          modifiersClassNames={{
            hasVacation: "bg-primary/10 text-primary font-medium",
          }}
          components={{
            Day: ({ date, ...props }: DayProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
              const vacations = getVacationsForDay(date);
              
              return (
                <VacationDayContent
                  date={date}
                  vacations={vacations}
                  employeeDepartments={employeeDepartments}
                  dayProps={props}
                />
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
};
