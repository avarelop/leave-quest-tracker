
import React from 'react';
import { Header } from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className={`flex-1 pt-24 pb-${isMobile ? '20' : '8'} px-4 md:px-6 max-w-7xl w-full mx-auto`}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
