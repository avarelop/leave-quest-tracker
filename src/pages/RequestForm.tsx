import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Form validation schema
const formSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }).refine(date => date instanceof Date, {
    message: "End date is required",
  }),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
});

const RequestForm = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !currentUser) {
      navigate('/sign-in');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      reason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
      toast.error('You must be logged in to submit a request');
      return;
    }
    
    try {
      // Format dates for Postgres
      const formattedStartDate = format(values.startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(values.endDate, 'yyyy-MM-dd');
      
      // Submit to Supabase
      const { error } = await supabase
        .from('vacation_requests')
        .insert({
          user_id: currentUser.id,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          reason: values.reason,
          status: 'pending'
        });
      
      if (error) throw error;
      
      // Show success message
      toast.success('Leave request submitted successfully');
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit leave request');
    }
  }

  return (
    <Layout>
      <div className="w-full max-w-xl mx-auto animate-slide-up">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">New Leave Request</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMMM d, yyyy")
                                ) : (
                                  <span>Select a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMMM d, yyyy")
                                ) : (
                                  <span>Select a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => 
                                date < new Date() || 
                                (form.getValues().startDate && date < form.getValues().startDate)
                              }
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Leave</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please provide a reason for your leave request" 
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Briefly explain why you are requesting time off.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardFooter className="px-0 pb-0">
                  <div className="flex justify-end space-x-2 w-full">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/dashboard')}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit Request</Button>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RequestForm;
