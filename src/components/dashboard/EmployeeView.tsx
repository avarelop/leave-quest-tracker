
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RequestList } from '@/components/dashboard/RequestList';
import { RequestData } from '@/components/dashboard/RequestCard';

interface EmployeeViewProps {
  myRequests: RequestData[];
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({ myRequests }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Leave Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <RequestList 
          requests={myRequests} 
          isManager={false}
          emptyMessage="You don't have any leave requests."
        />
      </CardContent>
    </Card>
  );
};
