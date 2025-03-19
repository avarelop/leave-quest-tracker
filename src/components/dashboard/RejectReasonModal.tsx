
import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  reason: z.string().min(10, {
    message: "Rejection reason must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  employeeName: string;
  onSubmit: (requestId: string, reason: string) => void;
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  isOpen,
  onClose,
  requestId,
  employeeName,
  onSubmit,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(requestId, values.reason);
    form.reset();
    onClose();
    toast.success(`Vacation request for ${employeeName} was denied`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deny Vacation Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for denying {employeeName}'s vacation request.
            This will be included in the notification email.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                onClick={onClose}
              >
                Cancel
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
};
