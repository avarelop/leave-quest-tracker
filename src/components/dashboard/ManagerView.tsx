
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequestList } from '@/components/dashboard/RequestList';
import { VacationCalendar } from '@/components/calendar/VacationCalendar';
import { RequestData } from '@/components/dashboard/RequestCard';
import { FilterSection } from './FilterSection';

interface ManagerViewProps {
  filteredRequests: RequestData[];
  pendingRequests: RequestData[];
  approvedRequests: RequestData[];
  deniedRequests: RequestData[];
  departments: string[];
  searchTerm: string;
  departmentFilter: string;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onResetFilters: () => void;
}

export const ManagerView: React.FC<ManagerViewProps> = ({
  filteredRequests,
  pendingRequests,
  approvedRequests,
  deniedRequests,
  departments,
  searchTerm,
  departmentFilter,
  onSearchChange,
  onDepartmentChange,
  onResetFilters,
}) => {
  const [activeTab, setActiveTab] = useState<string>('pending');

  return (
    <>
      {/* Filter section */}
      <FilterSection 
        searchTerm={searchTerm}
        departmentFilter={departmentFilter}
        departments={departments}
        onSearchChange={onSearchChange}
        onDepartmentChange={onDepartmentChange}
        onResetFilters={onResetFilters}
      />

      {/* Requests card */}
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
                  emptyMessage={
                    searchTerm || departmentFilter 
                      ? "No pending requests match your filters." 
                      : "No pending requests found."
                  }
                />
              </TabsContent>
              <TabsContent value="approved" className="mt-0">
                <RequestList 
                  requests={approvedRequests} 
                  isManager={true}
                  emptyMessage={
                    searchTerm || departmentFilter
                      ? "No approved requests match your filters."
                      : "No approved requests found."
                  }
                />
              </TabsContent>
              <TabsContent value="denied" className="mt-0">
                <RequestList 
                  requests={deniedRequests} 
                  isManager={true}
                  emptyMessage={
                    searchTerm || departmentFilter
                      ? "No denied requests match your filters."
                      : "No denied requests found."
                  }
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Calendar */}
      <VacationCalendar 
        requests={filteredRequests}
        isManager={true}
      />
    </>
  );
};
