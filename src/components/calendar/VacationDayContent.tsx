
import React from 'react';
import { format } from 'date-fns';
import { RequestData } from '@/components/dashboard/RequestCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DepartmentMapping {
  [key: string]: string;
}

interface VacationDayContentProps {
  date: Date;
  vacations: RequestData[];
  employeeDepartments: DepartmentMapping;
  dayProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export const VacationDayContent: React.FC<VacationDayContentProps> = ({
  date,
  vacations,
  employeeDepartments,
  dayProps,
}) => {
  const hasVacations = vacations.length > 0;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          {...dayProps}
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
};
