
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RequestList } from '@/components/dashboard/RequestList';
import { RequestData } from '@/components/dashboard/RequestCard';
import { VacationCalendar } from '@/components/calendar/VacationCalendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface EmployeeViewProps {
  myRequests: RequestData[];
  onRequestStatusChange?: (updatedRequest: RequestData) => void;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({ 
  myRequests, 
  onRequestStatusChange 
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Filter requests by status for the tabs
  const pendingRequests = myRequests.filter(req => req.status === 'pending');
  const approvedRequests = myRequests.filter(req => req.status === 'approved');
  const deniedRequests = myRequests.filter(req => req.status === 'denied');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Calendar view for employees - on the left */}
      <VacationCalendar 
        requests={myRequests.filter(req => req.status === 'approved')}
        isManager={false}
        className="h-full"
        calendarClassName="w-full"
      />
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle>My Leave Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all">
                  All ({myRequests.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="denied">
                  Denied ({deniedRequests.length})
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="all" className="mt-0">
                <RequestList 
                  requests={myRequests} 
                  isManager={false}
                  onRequestStatusChange={onRequestStatusChange}
                  emptyMessage="You don't have any leave requests."
                />
              </TabsContent>
              <TabsContent value="pending" className="mt-0">
                <RequestList 
                  requests={pendingRequests} 
                  isManager={false}
                  onRequestStatusChange={onRequestStatusChange}
                  emptyMessage="You don't have any pending requests."
                />
              </TabsContent>
              <TabsContent value="approved" className="mt-0">
                <RequestList 
                  requests={approvedRequests} 
                  isManager={false}
                  onRequestStatusChange={onRequestStatusChange}
                  emptyMessage="You don't have any approved requests."
                />
              </TabsContent>
              <TabsContent value="denied" className="mt-0">
                <RequestList 
                  requests={deniedRequests} 
                  isManager={false}
                  onRequestStatusChange={onRequestStatusChange}
                  emptyMessage="You don't have any denied requests."
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
