
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RequestList } from '@/components/dashboard/RequestList';
import { RequestData } from '@/components/dashboard/RequestCard';

interface EmployeeViewProps {
  myRequests: RequestData[];
  onRequestStatusChange?: (updatedRequest: RequestData) => void;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({ 
  myRequests, 
  onRequestStatusChange 
}) => {
  return (
    <Card>
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
  );
};
