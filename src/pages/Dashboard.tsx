
import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ManagerView } from '@/components/dashboard/ManagerView';
import { EmployeeView } from '@/components/dashboard/EmployeeView';
import { departments, employeeDepartments, mockRequests } from '@/components/dashboard/MockData';

// In a real app, we would determine if the user is a manager through authentication
const Dashboard = () => {
  const [isManager, setIsManager] = useState<boolean>(true); // Default to manager view for demo
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Apply filters to requests
  const filteredRequests = useMemo(() => {
    return mockRequests.filter(req => {
      // Text search filter
      if (searchTerm && !req.employee.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Department filter
      if (departmentFilter !== 'all' && employeeDepartments[req.employee.id] !== departmentFilter) {
        return false;
      }
      
      return true;
    });
  }, [searchTerm, departmentFilter]);
  
  // Filter requests based on status and role
  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');
  const approvedRequests = filteredRequests.filter(req => req.status === 'approved');
  const deniedRequests = filteredRequests.filter(req => req.status === 'denied');
  const myRequests = filteredRequests.filter(req => req.employee.id === '101'); // Assume logged in user is John Doe

  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
  };

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
            <ManagerView 
              filteredRequests={filteredRequests}
              pendingRequests={pendingRequests}
              approvedRequests={approvedRequests}
              deniedRequests={deniedRequests}
              departments={departments}
              searchTerm={searchTerm}
              departmentFilter={departmentFilter}
              onSearchChange={setSearchTerm}
              onDepartmentChange={setDepartmentFilter}
              onResetFilters={resetFilters}
            />
          ) : (
            <EmployeeView myRequests={myRequests} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
