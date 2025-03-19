
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { VacationCalendar } from '@/components/calendar/VacationCalendar';
import { RequestData } from '@/components/dashboard/RequestCard';

// Mock data for demo purposes - same as in Dashboard
const mockRequests: RequestData[] = [
  {
    id: '1',
    employee: { id: '101', name: 'John Doe' },
    startDate: new Date('2023-07-10'),
    endDate: new Date('2023-07-15'),
    status: 'pending',
    reason: 'Taking a summer vacation with family.',
    requestedOn: new Date('2023-06-25')
  },
  {
    id: '2',
    employee: { id: '102', name: 'Jane Smith' },
    startDate: new Date('2023-08-01'),
    endDate: new Date('2023-08-05'),
    status: 'approved',
    reason: 'Personal time off for family event.',
    requestedOn: new Date('2023-07-15')
  },
  {
    id: '3',
    employee: { id: '103', name: 'Mike Johnson' },
    startDate: new Date('2023-08-20'),
    endDate: new Date('2023-08-25'),
    status: 'denied',
    reason: 'Vacation cancelled due to urgent project deadline.',
    requestedOn: new Date('2023-07-20')
  },
  {
    id: '4',
    employee: { id: '104', name: 'Sarah Williams' },
    startDate: new Date('2023-09-05'),
    endDate: new Date('2023-09-15'),
    status: 'pending',
    reason: 'Taking a trip to Europe.',
    requestedOn: new Date('2023-08-01')
  },
  {
    id: '5',
    employee: { id: '105', name: 'David Brown' },
    startDate: new Date('2023-10-10'),
    endDate: new Date('2023-10-20'),
    status: 'approved',
    reason: 'Annual leave for fall holiday.',
    requestedOn: new Date('2023-09-01')
  }
];

const CalendarPage = () => {
  // In a real app, we would determine if the user is a manager through authentication
  const isManager = true; // For demo purposes

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vacation Calendar</h1>
          <p className="text-muted-foreground mt-1">
            View approved leaves on the calendar
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <VacationCalendar
              requests={mockRequests}
              isManager={isManager}
              className="shadow-md rounded-lg"
              calendarClassName="p-4 md:p-6 lg:p-8"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
