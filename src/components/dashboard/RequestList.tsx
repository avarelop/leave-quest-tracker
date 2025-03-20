
import React, { useState } from 'react';
import { RequestCard, RequestData } from './RequestCard';
import { RejectReasonModal } from './RejectReasonModal';
import { StatusChangeModal } from './StatusChangeModal';
import { RequestStatus } from './StatusBadge';
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
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  // Create a mutable copy of the requests that we can update
  const [requestsData, setRequestsData] = useState<RequestData[]>(requests);
  
  const selectedRequest = selectedRequestId 
    ? requestsData.find(req => req.id === selectedRequestId) 
    : null;

  const handleApprove = (id: string) => {
    // Update the request status in our local state
    setRequestsData(prevRequests => 
      prevRequests.map(req => 
        req.id === id ? { ...req, status: 'approved' } : req
      )
    );
    
    toast.success('Request approved successfully');
    console.log(`Approving request ${id}`);
  };

  const handleDeny = (id: string) => {
    // Open the rejection reason modal
    setSelectedRequestId(id);
    setRejectModalOpen(true);
  };
  
  const handleChangeStatus = (id: string) => {
    setSelectedRequestId(id);
    setStatusChangeModalOpen(true);
  };

  const handleRejectSubmit = (id: string, reason: string) => {
    // Update the request status and add the denial reason
    setRequestsData(prevRequests => 
      prevRequests.map(req => 
        req.id === id ? { ...req, status: 'denied', denialReason: reason } : req
      )
    );
    
    console.log(`Denying request ${id} with reason: ${reason}`);
  };
  
  const handleStatusChange = (id: string, newStatus: RequestStatus) => {
    // Update the request status in our local state
    setRequestsData(prevRequests => 
      prevRequests.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
    
    console.log(`Changing request ${id} status to ${newStatus}`);
  };

  // Update component to handle empty requests array properly
  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requestsData.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            isManager={isManager}
            onApprove={handleApprove}
            onDeny={handleDeny}
            onChangeStatus={handleChangeStatus}
            className="animate-slide-up"
          />
        ))}
      </div>
      
      {selectedRequest && (
        <>
          <RejectReasonModal
            isOpen={rejectModalOpen}
            onClose={() => setRejectModalOpen(false)}
            requestId={selectedRequest.id}
            employeeName={selectedRequest.employee.name}
            onSubmit={handleRejectSubmit}
          />
          
          <StatusChangeModal
            isOpen={statusChangeModalOpen}
            onClose={() => setStatusChangeModalOpen(false)}
            request={selectedRequest}
            onStatusChange={handleStatusChange}
          />
        </>
      )}
    </>
  );
};
