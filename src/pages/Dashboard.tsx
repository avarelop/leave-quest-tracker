
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { RequestList } from '@/components/dashboard/RequestList';
import { RequestData } from '@/components/dashboard/RequestCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Mock data for demo purposes
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

// In a real app, we would determine if the user is a manager through authentication
// For this demo, we'll use a state toggle
const Dashboard = () => {
  const [isManager, setIsManager] = useState<boolean>(true); // Default to manager view for demo
  const [activeTab, setActiveTab] = useState<string>('pending');
  
  // Filter requests based on status and role
  const pendingRequests = mockRequests.filter(req => req.status === 'pending');
  const approvedRequests = mockRequests.filter(req => req.status === 'approved');
  const deniedRequests = mockRequests.filter(req => req.status === 'denied');
  const myRequests = mockRequests.filter(req => req.employee.id === '101'); // Assume logged in user is John Doe

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vacation Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {isManager 
                ? 'Manage your team\'s leave requests' 
                : 'View and manage your leave requests'}
            </p>
          </div>
          
          {/* Role toggle for demo purposes */}
          <Button 
            variant="outline" 
            onClick={() => setIsManager(!isManager)}
            className="animate-fade-in"
          >
            Switch to {isManager ? 'Employee' : 'Manager'} View
          </Button>
        </div>
        
        <div className="grid gap-6">
          {isManager ? (
            <>
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle>Team Leave Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
                    <div className="px-6">
                      <TabsList className="w-full grid grid-cols-3">
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
                      <TabsContent value="pending" className="mt-0">
                        <RequestList 
                          requests={pendingRequests} 
                          isManager={true}
                          emptyMessage="No pending requests found."
                        />
                      </TabsContent>
                      <TabsContent value="approved" className="mt-0">
                        <RequestList 
                          requests={approvedRequests} 
                          isManager={true}
                          emptyMessage="No approved requests found."
                        />
                      </TabsContent>
                      <TabsContent value="denied" className="mt-0">
                        <RequestList 
                          requests={deniedRequests} 
                          isManager={true}
                          emptyMessage="No denied requests found."
                        />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
