
import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isManager?: boolean;
  photoURL?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create a context for authentication
const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo purposes
const MOCK_USERS: { [key: string]: User & { password: string } } = {
  'admin@example.com': { 
    id: '101', 
    name: 'John Doe', 
    email: 'admin@example.com', 
    password: 'password123', 
    isManager: true 
  },
  'employee@example.com': { 
    id: '102', 
    name: 'Jane Smith', 
    email: 'employee@example.com', 
    password: 'password123', 
    isManager: false 
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<void> => {
    // In a real app, this would make an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS[email];
        
        if (user && user.password === password) {
          const { password, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000); // Simulate network delay
    });
  };

  // Sign in with Google function
  const signInWithGoogle = async (): Promise<void> => {
    // In a real app, this would use Firebase or another OAuth provider
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Create a mock Google user
          const googleUser: User = {
            id: 'google-' + Math.random().toString(36).substring(2, 15),
            name: 'Google User',
            email: 'google-user@example.com',
            isManager: false,
            photoURL: 'https://lh3.googleusercontent.com/a/default-user'
          };
          
          setCurrentUser(googleUser);
          localStorage.setItem('user', JSON.stringify(googleUser));
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000); // Simulate network delay
    });
  };

  // Sign up function
  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    // In a real app, this would make an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (MOCK_USERS[email]) {
          reject(new Error('Email already in use'));
          return;
        }
        
        // Create a new user
        const newUser = {
          id: Math.random().toString(36).substring(2, 15),
          name,
          email,
          password,
          isManager: false // Default to regular employee
        };
        
        // Add to mock database
        MOCK_USERS[email] = newUser;
        
        // Store user in state and localStorage (without password)
        const { password: _, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        resolve();
      }, 1000); // Simulate network delay
    });
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    return Promise.resolve();
  };

  // Value provided by the context
  const value: AuthContextType = {
    currentUser,
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
