import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, User, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { StatusBadge, RequestStatus } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RequestData {
  id: string;
  employee: {
    id: string;
    name: string;
    avatar?: string;
  };
  startDate: Date;
  endDate: Date;
  status: RequestStatus;
  reason: string;
  requestedOn: Date;
  denialReason?: string;
  createdAt?: Date;
}

interface RequestCardProps {
  request: RequestData;
  isManager?: boolean;
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
  onChangeStatus?: (id: string) => void;
  className?: string;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  isManager = false,
  onApprove,
  onDeny,
  onChangeStatus,
  className,
}) => {
  const duration = Math.ceil((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <div className={cn(
        "h-2",
        request.status === 'pending' ? "bg-status-pending" : 
        request.status === 'approved' ? "bg-status-approved" : 
        "bg-status-denied"
      )} />
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                {isManager && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="ml-1 font-medium">{request.employee.name}</span>
                  </div>
                )}
                <StatusBadge status={request.status} />
              </div>
              
              {isManager && request.status !== 'pending' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onChangeStatus?.(request.id)}>
                      Change status
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(request.startDate, 'MMM d, yyyy')}</span>
              <span>-</span>
              <span>{format(request.endDate, 'MMM d, yyyy')}</span>
              <span className="font-medium text-foreground">({duration} {duration === 1 ? 'day' : 'days'})</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {request.reason.length > 120 ? `${request.reason.substring(0, 120)}...` : request.reason}
            </p>
            
            {request.status === 'denied' && request.denialReason && (
              <div className="mt-3 p-2 bg-status-denied/5 border border-status-denied/10 rounded-md">
                <p className="text-xs font-medium text-status-denied mb-1">Denial reason:</p>
                <p className="text-xs text-muted-foreground">
                  {request.denialReason}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {isManager && request.status === 'pending' && (
        <CardFooter className="px-6 py-4 bg-secondary/50 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDeny?.(request.id)}
            className="border-status-denied text-status-denied hover:bg-status-denied/10"
          >
            Deny
          </Button>
          <Button 
            size="sm" 
            onClick={() => onApprove?.(request.id)}
            className="bg-status-approved hover:bg-status-approved/90"
          >
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
