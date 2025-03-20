
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { RequestData } from '@/components/dashboard/RequestCard';
import { VacationCalendar } from '@/components/calendar/VacationCalendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeCheck, Calendar, Users } from 'lucide-react';

interface TeamVacationPlanningProps {
  requests: RequestData[];
  departments: string[];
}

export const TeamVacationPlanning: React.FC<TeamVacationPlanningProps> = ({ 
  requests,
  departments
}) => {
  // Only approved requests are relevant for the team vacation planning
  const approvedRequests = requests.filter(req => req.status === 'approved');
  
  // Create a mapping of employee IDs to their initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>Team Vacation Planning</CardTitle>
        </div>
        <CardDescription>
          View and manage your team's vacation schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" />
              Availability Overview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-0">
            <VacationCalendar 
              requests={approvedRequests}
              isManager={true}
              calendarClassName="w-full"
            />
          </TabsContent>
          
          <TabsContent value="employees" className="mt-0">
            <div className="grid gap-4">
              {/* Calculate employee availability by month */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {approvedRequests.map((request) => (
                  <div key={request.id} className="flex items-start space-x-4 rounded-lg border p-4">
                    <Avatar>
                      <AvatarFallback>{getInitials(request.employee.name)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{request.employee.name}</p>
                      <div className="text-xs text-muted-foreground">
                        <p>
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </p>
                        <p className="mt-1">{request.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {approvedRequests.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No approved vacation requests found
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
