import React, { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RequestStatus } from './StatusBadge';
import { RequestData } from './RequestCard';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const reasonFormSchema = z.object({
  reason: z.string().min(10, {
    message: "Rejection reason must be at least 10 characters.",
  }),
});

type ReasonFormValues = z.infer<typeof reasonFormSchema>;

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: RequestData;
  onStatusChange: (requestId: string, newStatus: RequestStatus, reason?: string) => void;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  onClose,
  request,
  onStatusChange,
}) => {
  const [showReasonForm, setShowReasonForm] = useState(false);
  
  const form = useForm<ReasonFormValues>({
    resolver: zodResolver(reasonFormSchema),
    defaultValues: {
      reason: '',
    },
  });
  
  const handleStatusChange = (newStatus: RequestStatus) => {
    // If changing to denied from approved, show the reason form
    if (newStatus === 'denied' && request.status === 'approved') {
      setShowReasonForm(true);
      return;
    }
    
    // Otherwise, proceed with the status change
    onStatusChange(request.id, newStatus);
    onClose();
    
    const action = newStatus === 'approved' ? 'approved' : newStatus === 'pending' ? 'set to pending' : 'denied';
    toast.success(`Vacation request for ${request.employee.name} was ${action}`);
  };
  
  const handleReasonSubmit = (values: ReasonFormValues) => {
    onStatusChange(request.id, 'denied', values.reason);
    form.reset();
    onClose();
    toast.success(`Vacation request for ${request.employee.name} was denied`);
  };
  
  // Don't show current status as an option
  const showApprove = request.status !== 'approved';
  const showPending = request.status !== 'pending';
  const showDeny = request.status !== 'denied';

  if (showReasonForm) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          setShowReasonForm(false);
          onClose();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deny Vacation Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for denying {request.employee.name}'s vacation request.
              This will be included in the notification email.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleReasonSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for denial</FormLabel>
                    <Textarea 
                      placeholder="Please explain why this vacation request is being denied..."
                      className="min-h-[120px]"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReasonForm(false)}
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  className="bg-status-denied hover:bg-status-denied/90"
                >
                  Deny Request
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Vacation Status</DialogTitle>
          <DialogDescription>
            Update the status of {request.employee.name}'s vacation request.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-col space-y-2">
            {showApprove && (
              <Button 
                onClick={() => handleStatusChange('approved')}
                className="justify-start text-left px-4 py-3 h-auto bg-status-approved/10 text-status-approved hover:bg-status-approved hover:text-white"
              >
                <Check className="h-5 w-5 mr-2" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Approve Request</span>
                  <span className="text-xs font-normal">Mark this request as approved</span>
                </div>
              </Button>
            )}
            
            {showPending && (
              <Button 
                onClick={() => handleStatusChange('pending')}
                className="justify-start text-left px-4 py-3 h-auto bg-status-pending/10 text-status-pending hover:bg-status-pending hover:text-white"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Reset to Pending</span>
                  <span className="text-xs font-normal">Return this request to pending status</span>
                </div>
              </Button>
            )}
            
            {showDeny && (
              <Button 
                onClick={() => handleStatusChange('denied')}
                className="justify-start text-left px-4 py-3 h-auto bg-status-denied/10 text-status-denied hover:bg-status-denied hover:text-white"
              >
                <X className="h-5 w-5 mr-2" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Deny Request</span>
                  <span className="text-xs font-normal">Mark this request as denied</span>
                </div>
              </Button>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
