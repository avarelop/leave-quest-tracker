
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RequestList } from '@/components/dashboard/RequestList';
import { RequestData } from '@/components/dashboard/RequestCard';
import { VacationCalendar } from '@/components/calendar/VacationCalendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Clock, User } from 'lucide-react';

interface EmployeeViewProps {
  myRequests: RequestData[];
  onRequestStatusChange?: (updatedRequest: RequestData) => void;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({ 
  myRequests, 
  onRequestStatusChange 
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Calculate leave balance based on request statuses
  const [leaveBalance, setLeaveBalance] = useState({
    totalDays: 25,
    usedDays: 0,
    pendingDays: 0,
  });
  
  // Filter requests by status for the tabs
  const pendingRequests = myRequests.filter(req => req.status === 'pending');
  const approvedRequests = myRequests.filter(req => req.status === 'approved');
  const deniedRequests = myRequests.filter(req => req.status === 'denied');

  // Update leave balance whenever requests change
  useEffect(() => {
    // Count days for each request
    const calculateDays = (request: RequestData) => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      // Simple calculation: difference in days (including weekends for simplicity)
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    };
    
    // Calculate used and pending days
    let usedDays = 0;
    let pendingDays = 0;
    
    myRequests.forEach(request => {
      const days = calculateDays(request);
      if (request.status === 'approved') {
        usedDays += days;
      } else if (request.status === 'pending') {
        pendingDays += days;
      }
    });
    
    setLeaveBalance({
      totalDays: 25, // Fixed total for demo
      usedDays,
      pendingDays
    });
  }, [myRequests]);

  // Custom handler for request status changes to update balance immediately
  const handleRequestStatusChange = (updatedRequest: RequestData) => {
    if (onRequestStatusChange) {
      onRequestStatusChange(updatedRequest);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-10 gap-6">
        {/* Calendar view for employees - with reduced width (30%) and increased height */}
        <VacationCalendar 
          requests={approvedRequests}
          isManager={false}
          className="col-span-3 h-auto max-h-[500px]"
          calendarClassName="w-full scale-95 transform origin-top"
        />
        
        {/* Leave Balance - on the right with increased width (70%) and increased height */}
        <Card className="col-span-7 animate-slide-up h-auto max-h-[500px]">
          <CardHeader className="pb-2">
            <CardTitle>Leave Balance</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 rounded-md bg-secondary">
                <Calendar className="h-6 w-6 text-primary mb-1" />
                <div className="text-2xl font-bold">{leaveBalance.totalDays}</div>
                <div className="text-xs text-muted-foreground text-center">Total Days</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-md bg-secondary">
                <Clock className="h-6 w-6 text-status-pending mb-1" />
                <div className="text-2xl font-bold">{leaveBalance.pendingDays}</div>
                <div className="text-xs text-muted-foreground text-center">Pending</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-md bg-secondary">
                <Calendar className="h-6 w-6 text-status-approved mb-1" />
                <div className="text-2xl font-bold">{leaveBalance.usedDays}</div>
                <div className="text-xs text-muted-foreground text-center">Used</div>
              </div>
            </div>
            
            <div className="relative pt-2">
              <div className="text-sm mb-2 flex justify-between">
                <span>Leave Usage</span>
                <span className="text-muted-foreground">{Math.floor((leaveBalance.usedDays / leaveBalance.totalDays) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${(leaveBalance.usedDays / leaveBalance.totalDays) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {leaveBalance.totalDays - leaveBalance.usedDays - leaveBalance.pendingDays} days remaining
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* My Leave Requests - below both components */}
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
                  onRequestStatusChange={handleRequestStatusChange}
                  emptyMessage="You don't have any leave requests."
                />
              </TabsContent>
              <TabsContent value="pending" className="mt-0">
                <RequestList 
                  requests={pendingRequests} 
                  isManager={false}
                  onRequestStatusChange={handleRequestStatusChange}
                  emptyMessage="You don't have any pending requests."
                />
              </TabsContent>
              <TabsContent value="approved" className="mt-0">
                <RequestList 
                  requests={approvedRequests} 
                  isManager={false}
                  onRequestStatusChange={handleRequestStatusChange}
                  emptyMessage="You don't have any approved requests."
                />
              </TabsContent>
              <TabsContent value="denied" className="mt-0">
                <RequestList 
                  requests={deniedRequests} 
                  isManager={false}
                  onRequestStatusChange={handleRequestStatusChange}
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
