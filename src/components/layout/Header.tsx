
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Home, 
  PlusCircle, 
  User, 
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, isAuthenticated, signOut } = useAuth();

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
    { name: 'Profile', path: '/profile', icon: <User className="h-4 w-4" /> }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

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

        {isAuthenticated ? (
          <>
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
              {/* Only show new request button when authenticated */}
              <Link to="/request">
                <Button className="animate-slide-up">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {!isMobile && "New Request"}
                </Button>
              </Link>
              
              {/* User profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {currentUser ? `${currentUser.user_metadata?.first_name || ''} ${currentUser.user_metadata?.last_name || ''}` : 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>

      {isMobile && isAuthenticated && (
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
