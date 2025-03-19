
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type RequestStatus = 'pending' | 'approved' | 'denied';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-status-pending/10 text-status-pending border-status-pending/20',
          label: 'Pending',
          icon: <Clock className="h-3 w-3" />
        };
      case 'approved':
        return {
          color: 'bg-status-approved/10 text-status-approved border-status-approved/20',
          label: 'Approved',
          icon: <CheckCircle className="h-3 w-3" />
        };
      case 'denied':
        return {
          color: 'bg-status-denied/10 text-status-denied border-status-denied/20',
          label: 'Denied',
          icon: <XCircle className="h-3 w-3" />
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1 transition-all duration-300 font-normal',
        config.color,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};
