
import { useMemo } from 'react';
import { format } from 'date-fns';
import { RequestData } from '@/components/dashboard/RequestCard';
import { DateRangeFilter } from '@/components/calendar/CalendarFilters';

interface UseVacationDataProps {
  requests: RequestData[];
  employeeFilter: string;
  departmentFilter: string;
  dateRangeFilter: DateRangeFilter;
  employeeDepartments: Record<string, string>;
}

interface VacationDate {
  [date: string]: RequestData[];
}

export function useVacationData({
  requests,
  employeeFilter,
  departmentFilter,
  dateRangeFilter,
  employeeDepartments,
}: UseVacationDataProps) {
  // Apply filters to requests
  const filteredRequests = useMemo(() => {
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
  }, [requests, employeeFilter, departmentFilter, dateRangeFilter, employeeDepartments]);

  // Find all dates that have vacation requests
  const vacationDates = useMemo(() => {
    const dates: VacationDate = {};
    
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

  // Helper functions
  const dayHasVacation = (day: Date) => {
    return !!vacationDates[format(day, 'yyyy-MM-dd')];
  };

  const getVacationsForDay = (day: Date) => {
    return vacationDates[format(day, 'yyyy-MM-dd')] || [];
  };

  // Get unique employees from all requests
  const employees = useMemo(() => {
    const uniqueEmployees = new Map();
    requests.forEach(request => {
      if (!uniqueEmployees.has(request.employee.id)) {
        uniqueEmployees.set(request.employee.id, request.employee.name);
      }
    });
    return Array.from(uniqueEmployees).map(([id, name]) => ({ id, name }));
  }, [requests]);

  return {
    filteredRequests,
    vacationDates,
    dayHasVacation,
    getVacationsForDay,
    employees
  };
}
