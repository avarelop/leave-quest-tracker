
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create a context for authentication
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setCurrentUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      // Special case for alvaro.valera@samara.energy
      if (email === 'alvaro.valera@samara.energy' && password === 'alvaro1234') {
        // Create a mock user and session for this specific login
        // Using a proper UUID format for the mock user ID
        const mockUser = {
          id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID format
          email: 'alvaro.valera@samara.energy',
          user_metadata: {
            first_name: 'Alvaro',
            last_name: 'Valera',
          },
          app_metadata: {
            provider: 'email',
          },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;
        
        const mockSession = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          user: mockUser,
          expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        } as Session;
        
        // Set the mock user and session
        setCurrentUser(mockUser);
        setSession(mockSession);
        
        // Store in localStorage to persist across page refreshes
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        localStorage.setItem('mockSession', JSON.stringify(mockSession));
        
        return;
      }
      
      // Normal Supabase login for all other users
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Check for mock user on component mount
  useEffect(() => {
    const mockUser = localStorage.getItem('mockUser');
    const mockSession = localStorage.getItem('mockSession');
    
    if (mockUser && mockSession && !currentUser) {
      setCurrentUser(JSON.parse(mockUser));
      setSession(JSON.parse(mockSession));
      setIsLoading(false);
    }
  }, [currentUser]);

  // Sign in with Google function
  const signInWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign up function
  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Split name into first and last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Use user_metadata instead of data.first_name/last_name
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      if (error) {
        console.error('Error signing up:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      // Clear mock user if exists
      if (localStorage.getItem('mockUser')) {
        localStorage.removeItem('mockUser');
        localStorage.removeItem('mockSession');
        setCurrentUser(null);
        setSession(null);
        return;
      }
      
      // Otherwise use Supabase signout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Value provided by the context
  const value: AuthContextType = {
    currentUser,
    session,
    isLoading,
    isAuthenticated: !!currentUser,
    signIn,
    signInWithGoogle,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
