
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ManagerView } from '@/components/dashboard/ManagerView';
import { EmployeeView } from '@/components/dashboard/EmployeeView';
import { RequestData } from '@/components/dashboard/RequestCard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { departments } from '@/components/dashboard/MockData';
import { toast } from 'sonner';

// Mock vacation requests for Alvaro
const mockVacationRequests = [
  {
    id: '1',
    employee: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Alvaro Valera'
    },
    startDate: new Date('2024-04-10'),
    endDate: new Date('2024-04-15'),
    reason: 'Family vacation',
    status: 'approved',
    requestedOn: new Date('2024-03-01'),
    createdAt: new Date('2024-03-01')
  },
  {
    id: '2',
    employee: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Alvaro Valera'
    },
    startDate: new Date('2024-05-20'),
    endDate: new Date('2024-05-22'),
    reason: 'Personal days',
    status: 'pending',
    requestedOn: new Date('2024-03-15'),
    createdAt: new Date('2024-03-15')
  },
  {
    id: '3',
    employee: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Alvaro Valera'
    },
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-02-07'),
    reason: 'Medical appointment',
    status: 'denied',
    requestedOn: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20')
  }
];

// Convert database vacation request to our app's RequestData format
const mapVacationRequestToRequestData = (
  vacationRequest: any, 
  userData: any
): RequestData => {
  return {
    id: vacationRequest.id,
    employee: {
      id: userData.id,
      name: `${userData.first_name} ${userData.last_name}`
    },
    startDate: new Date(vacationRequest.start_date),
    endDate: new Date(vacationRequest.end_date),
    reason: vacationRequest.reason,
    status: vacationRequest.status,
    requestedOn: new Date(vacationRequest.created_at),
    createdAt: new Date(vacationRequest.created_at)
  };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !currentUser) {
      navigate('/sign-in');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const [isManager, setIsManager] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Use state to manage requests
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [departmentEmployees, setDepartmentEmployees] = useState<{[id: string]: string}>({});
  const [userDepartment, setUserDepartment] = useState<string>('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Determine if we're using the mock user
  const isMockUser = currentUser?.id === '550e8400-e29b-41d4-a716-446655440000';
  
  // Fetch user role and department
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        // For mock user, set predefined values
        if (isMockUser) {
          setIsManager(false);
          setIsAdmin(false);
          setUserDepartment('Engineering');
          return;
        }
        
        // For real users, fetch from database
        const { data: userData, error } = await supabase
          .from('users')
          .select('role, department_id, departments(name)')
          .eq('id', currentUser.id)
          .single();
        
        if (error) throw error;
        
        // Set role flags
        setIsManager(userData.role === 'manager');
        setIsAdmin(userData.role === 'admin');
        
        // Set user department
        if (userData.departments) {
          setUserDepartment(userData.departments.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };
    
    fetchUserData();
  }, [currentUser, isMockUser]);
  
  // Fetch vacation requests based on user role
  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      
      try {
        // For mock user, use mock data
        if (isMockUser) {
          // Get mock requests from localStorage or use default
          const storedRequests = localStorage.getItem('mockVacationRequests');
          if (storedRequests) {
            // Parse stored requests but ensure dates are proper Date objects
            const parsedRequests = JSON.parse(storedRequests);
            const fixedDates = parsedRequests.map((req: any) => ({
              ...req,
              startDate: new Date(req.startDate),
              endDate: new Date(req.endDate),
              requestedOn: new Date(req.requestedOn),
              createdAt: new Date(req.createdAt)
            }));
            setRequests(fixedDates);
          } else {
            setRequests(mockVacationRequests);
            // Store initial mock data
            localStorage.setItem('mockVacationRequests', JSON.stringify(mockVacationRequests));
          }
          
          // Set mock department
          setDepartmentEmployees({
            [currentUser.id]: 'Engineering'
          });
          
          setIsLoading(false);
          return;
        }
        
        // For real users, fetch from database
        const { data: vacationRequests, error } = await supabase
          .from('vacation_requests')
          .select('*');
        
        if (error) throw error;
        
        // We need to fetch user data for each vacation request
        const userIds = [...new Set(vacationRequests.map(req => req.user_id))];
        
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name, department_id, departments(name)')
          .in('id', userIds);
        
        if (usersError) throw usersError;
        
        // Create a map of user IDs to user data for easy lookup
        const userMap = users.reduce((map, user) => {
          map[user.id] = user;
          return map;
        }, {});
        
        // Map department IDs to names
        const departmentEmployeesMap = {};
        users.forEach(user => {
          if (user.department_id && user.departments) {
            departmentEmployeesMap[user.id] = user.departments.name;
          }
        });
        
        setDepartmentEmployees(departmentEmployeesMap);
        
        // Convert vacation requests to RequestData format
        const mappedRequests = vacationRequests.map(req => 
          mapVacationRequestToRequestData(req, userMap[req.user_id])
        );
        
        setRequests(mappedRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to load vacation requests');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequests();
  }, [currentUser, isMockUser]);
  
  // Apply filters to requests
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Text search filter
      if (searchTerm && !req.employee.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Department filter
      if (departmentFilter !== 'all' && departmentEmployees[req.employee.id] !== departmentFilter) {
        return false;
      }
      
      return true;
    });
  }, [searchTerm, departmentFilter, requests, departmentEmployees]);
  
  // Filter requests based on status and role
  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');
  const approvedRequests = filteredRequests.filter(req => req.status === 'approved');
  const deniedRequests = filteredRequests.filter(req => req.status === 'denied');
  
  // For employees, only show their own requests
  const myRequests = filteredRequests.filter(req => 
    currentUser && req.employee.id === currentUser.id
  );

  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
  };

  // Handle request status changes
  const handleRequestStatusChange = useCallback(async (updatedRequest: RequestData) => {
    if (!currentUser) return;
    
    try {
      // For mock user, update localStorage
      if (isMockUser) {
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === updatedRequest.id ? updatedRequest : req
          )
        );
        
        // Update in localStorage
        const updatedRequests = requests.map(req => 
          req.id === updatedRequest.id ? updatedRequest : req
        );
        localStorage.setItem('mockVacationRequests', JSON.stringify(updatedRequests));
        
        toast.success(`Request ${updatedRequest.status} successfully`);
        return;
      }
      
      // For real users, update in database
      const { error } = await supabase
        .from('vacation_requests')
        .update({ 
          status: updatedRequest.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedRequest.id);
      
      if (error) throw error;
      
      // If successful, update the local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === updatedRequest.id ? updatedRequest : req
        )
      );
      
      toast.success(`Request ${updatedRequest.status} successfully`);
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    }
  }, [currentUser, isMockUser, requests]);
  
  // Handle form submission for new vacation requests
  const handleNewRequest = (newRequestData: {
    startDate: Date;
    endDate: Date;
    reason: string;
  }) => {
    if (!currentUser) return;
    
    try {
      const now = new Date();
      
      // Create a new request object
      const newRequest: RequestData = {
        id: `mock-${Date.now()}`, // Generate a unique ID
        employee: {
          id: currentUser.id,
          name: currentUser.user_metadata?.first_name && currentUser.user_metadata?.last_name
            ? `${currentUser.user_metadata.first_name} ${currentUser.user_metadata.last_name}`
            : currentUser.email || 'Unknown User',
        },
        startDate: newRequestData.startDate,
        endDate: newRequestData.endDate,
        reason: newRequestData.reason,
        status: 'pending',
        requestedOn: now,
        createdAt: now
      };
      
      // For mock user, add to localStorage
      if (isMockUser) {
        const updatedRequests = [...requests, newRequest];
        setRequests(updatedRequests);
        localStorage.setItem('mockVacationRequests', JSON.stringify(updatedRequests));
        toast.success('Leave request submitted successfully');
        return;
      }
      
      // For real users, add to database
      // This will be handled by the RequestForm.tsx component
    } catch (error) {
      console.error('Error creating new request:', error);
      toast.error('Failed to create request');
    }
  };
  
  // Handle navigation to request form
  const handleNavigateToRequestForm = () => {
    navigate('/request-form');
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vacation Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {isManager || isAdmin
                ? 'Manage your team\'s leave requests' 
                : 'View and manage your leave requests'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleNavigateToRequestForm}>
              New Request
            </Button>
            
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => setIsManager(!isManager)}
                className="animate-fade-in"
              >
                Switch to {isManager ? 'Employee' : 'Manager'} View
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid gap-4">
          {(isManager || isAdmin) ? (
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
              onRequestStatusChange={handleRequestStatusChange}
            />
          ) : (
            <EmployeeView 
              myRequests={myRequests} 
              onRequestStatusChange={handleRequestStatusChange}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
