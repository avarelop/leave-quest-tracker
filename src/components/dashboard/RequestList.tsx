
import React, { useState, useEffect } from 'react';
import { RequestCard, RequestData } from './RequestCard';
import { RejectReasonModal } from './RejectReasonModal';
import { StatusChangeModal } from './StatusChangeModal';
import { RequestStatus } from './StatusBadge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RequestListProps {
  requests: RequestData[];
  isManager?: boolean;
  emptyMessage?: string;
  onRequestStatusChange?: (updatedRequest: RequestData) => void;
}

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  isManager = false,
  emptyMessage = "No requests found",
  onRequestStatusChange,
}) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  // Create a mutable copy of the requests that we can update
  const [requestsData, setRequestsData] = useState<RequestData[]>([]);
  
  // Update local state when requests prop changes
  useEffect(() => {
    setRequestsData(requests);
  }, [requests]);
  
  const selectedRequest = selectedRequestId 
    ? requestsData.find(req => req.id === selectedRequestId) 
    : null;

  const handleApprove = async (id: string) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('vacation_requests')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      // If successful, update local state
      const updatedRequests = requestsData.map(req => 
        req.id === id ? { ...req, status: 'approved' as RequestStatus } : req
      );
      
      // Find the updated request to pass to the parent component
      const updatedRequest = updatedRequests.find(req => req.id === id);
      
      // Update the local state
      setRequestsData(updatedRequests);
      
      // Notify the parent component about the status change
      if (updatedRequest && onRequestStatusChange) {
        onRequestStatusChange(updatedRequest);
      }
      
      toast.success('Request approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
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

  const handleRejectSubmit = async (id: string, reason: string) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('vacation_requests')
        .update({ 
          status: 'denied', 
          reason: reason, // Store denial reason in the reason field
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the request status and add the denial reason
      const updatedRequests = requestsData.map(req => 
        req.id === id ? { ...req, status: 'denied' as RequestStatus, denialReason: reason } : req
      );
      
      // Find the updated request to pass to the parent component
      const updatedRequest = updatedRequests.find(req => req.id === id);
      
      // Update the local state
      setRequestsData(updatedRequests);
      
      // Notify the parent component about the status change
      if (updatedRequest && onRequestStatusChange) {
        onRequestStatusChange(updatedRequest);
      }
      
      toast.success('Request denied successfully');
    } catch (error) {
      console.error('Error denying request:', error);
      toast.error('Failed to deny request');
    }
  };
  
  const handleStatusChange = async (id: string, newStatus: RequestStatus, reason?: string) => {
    try {
      // Prepare the update data
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      // Include reason if provided
      if (reason) {
        updateData.reason = reason;
      }
      
      // Update in database
      const { error } = await supabase
        .from('vacation_requests')
        .update(updateData)
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the request status in our local state
      const updatedRequests = requestsData.map(req => 
        req.id === id ? { 
          ...req, 
          status: newStatus,
          // Add denial reason if provided
          ...(reason ? { denialReason: reason } : {})
        } : req
      );
      
      // Find the updated request to pass to the parent component
      const updatedRequest = updatedRequests.find(req => req.id === id);
      
      // Update the local state
      setRequestsData(updatedRequests);
      
      // Notify the parent component about the status change
      if (updatedRequest && onRequestStatusChange) {
        onRequestStatusChange(updatedRequest);
      }
      
      toast.success(`Request ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    }
  };

  // Update component to handle empty requests array properly
  if (!requestsData || requestsData.length === 0) {
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
