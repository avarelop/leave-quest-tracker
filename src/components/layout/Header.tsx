
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Home, PlusCircle, User, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar className="h-4 w-4" /> },
    { name: 'Profile', path: '/profile', icon: <User className="h-4 w-4" /> }
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-in-out',
        isScrolled ? 'glass shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-medium">LeaveQuest</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button 
                variant={isActive(link.path) ? "secondary" : "ghost"} 
                className={cn(
                  "transition-all duration-300",
                  isActive(link.path) ? "font-medium" : "text-muted-foreground"
                )}
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Link to="/request">
            <Button className="animate-slide-up">
              <PlusCircle className="h-4 w-4 mr-2" />
              {!isMobile && "New Request"}
            </Button>
          </Link>
        </div>
      </div>

      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-40 p-2 flex justify-around">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={cn(
                "flex flex-col items-center p-2 rounded-md transition-all",
                isActive(link.path) 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {link.icon}
              <span className="text-xs mt-1">{link.name}</span>
            </Link>
          ))}
          <Link 
            to="/request" 
            className="flex flex-col items-center p-2 text-primary rounded-md"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="text-xs mt-1">Request</span>
          </Link>
        </nav>
      )}
    </header>
  );
};
