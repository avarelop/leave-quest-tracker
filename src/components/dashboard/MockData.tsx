
import { RequestData } from './RequestCard';

// Define departments for demo purposes
export const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations'
];

// For demo purposes, assign departments to employees
export const employeeDepartments: Record<string, string> = {
  '101': 'Engineering',
  '102': 'Marketing',
  '103': 'Sales',
  '104': 'HR',
  '105': 'Engineering',
};

// Mock data for demo purposes
export const mockRequests: RequestData[] = [
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
    requestedOn: new Date('2023-07-20'),
    denialReason: 'We have a critical project deadline during this period and require all team members to be available.'
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
