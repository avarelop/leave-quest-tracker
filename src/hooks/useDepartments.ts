
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Department {
  id: string;
  name: string;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        setDepartments(data || []);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch departments'));
        toast.error('Failed to load departments');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDepartments();
  }, []);

  return { departments, isLoading, error };
}
