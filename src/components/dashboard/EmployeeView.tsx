
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RequestList } from '@/components/dashboard/RequestList';
import { RequestData } from '@/components/dashboard/RequestCard';
import { VacationCalendar } from '@/components/calendar/VacationCalendar';

interface EmployeeViewProps {
  myRequests: RequestData[];
  onRequestStatusChange?: (updatedRequest: RequestData) => void;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({ 
  myRequests, 
  onRequestStatusChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>My Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestList 
            requests={myRequests} 
            isManager={false}
            onRequestStatusChange={onRequestStatusChange}
            emptyMessage="You don't have any leave requests."
          />
        </CardContent>
      </Card>
      
      {/* Calendar view for employees */}
      <VacationCalendar 
        requests={myRequests.filter(req => req.status === 'approved')}
        isManager={false}
        className="h-full"
        calendarClassName="w-full"
      />
    </div>
  );
};
