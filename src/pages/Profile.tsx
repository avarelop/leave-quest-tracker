
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';

const Profile = () => {
  // Mock user data
  const user = {
    id: '101',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Software Engineer',
    department: 'Engineering',
    manager: 'Jane Smith',
    avatar: '/placeholder.svg',
    totalDays: 25,
    usedDays: 10,
    pendingDays: 5,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>
              
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Email</div>
                  <div>{user.email}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Department</div>
                  <div>{user.department}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Manager</div>
                  <div>{user.manager}</div>
                </div>
              </div>
              
              <Button variant="outline">Edit Profile</Button>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up [animation-delay:200ms]">
            <CardHeader className="pb-2">
              <CardTitle>Leave Balance</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 rounded-md bg-secondary">
                  <Calendar className="h-6 w-6 text-primary mb-1" />
                  <div className="text-2xl font-bold">{user.totalDays}</div>
                  <div className="text-xs text-muted-foreground text-center">Total Days</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-md bg-secondary">
                  <Clock className="h-6 w-6 text-status-pending mb-1" />
                  <div className="text-2xl font-bold">{user.pendingDays}</div>
                  <div className="text-xs text-muted-foreground text-center">Pending</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-md bg-secondary">
                  <Calendar className="h-6 w-6 text-status-approved mb-1" />
                  <div className="text-2xl font-bold">{user.usedDays}</div>
                  <div className="text-xs text-muted-foreground text-center">Used</div>
                </div>
              </div>
              
              <div className="relative pt-2">
                <div className="text-sm mb-2 flex justify-between">
                  <span>Leave Usage</span>
                  <span className="text-muted-foreground">{Math.floor((user.usedDays / user.totalDays) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(user.usedDays / user.totalDays) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {user.totalDays - user.usedDays - user.pendingDays} days remaining
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
