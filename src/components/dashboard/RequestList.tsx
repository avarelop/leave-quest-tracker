
import React from 'react';
import { RequestCard, RequestData } from './RequestCard';
import { toast } from 'sonner';

interface RequestListProps {
  requests: RequestData[];
  isManager?: boolean;
  emptyMessage?: string;
}

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  isManager = false,
  emptyMessage = "No requests found",
}) => {
  const handleApprove = (id: string) => {
    toast.success('Request approved successfully');
    // Here you would typically call an API to approve the request
    console.log(`Approving request ${id}`);
  };

  const handleDeny = (id: string) => {
    toast.error('Request denied');
    // Here you would typically call an API to deny the request
    console.log(`Denying request ${id}`);
  };

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          isManager={isManager}
          onApprove={handleApprove}
          onDeny={handleDeny}
          className="animate-slide-up"
        />
      ))}
    </div>
  );
};
