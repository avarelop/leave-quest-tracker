
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestData } from '../dashboard/RequestCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DayProps } from 'react-day-picker';

interface VacationCalendarProps {
  requests: RequestData[];
  isManager?: boolean;
}

export const VacationCalendar: React.FC<VacationCalendarProps> = ({ 
  requests,
  isManager = false
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Find all dates that have vacation requests
  const vacationDates = React.useMemo(() => {
    const dates: Record<string, RequestData[]> = {};
    
    requests.forEach(request => {
      if (request.status === 'approved') {
        const start = new Date(request.startDate);
        const end = new Date(request.endDate);
        
        for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
          const dateStr = format(day, 'yyyy-MM-dd');
          if (!dates[dateStr]) {
            dates[dateStr] = [];
          }
          dates[dateStr].push(request);
        }
      }
    });
    
    return dates;
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vacation Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          onDayClick={handleDayClick}
          className="rounded-md p-3 pointer-events-auto mx-auto"
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
                              <div className="text-xs text-muted-foreground">
                                {format(vacation.startDate, "MMM d")} - {format(vacation.endDate, "MMM d, yyyy")}
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
