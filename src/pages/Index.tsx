
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Calendar, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <Calendar className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Welcome to LeaveQuest
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
            Simplify your leave management process with our intuitive tracking system.
            Request time off, view approvals, and manage your team's availability all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/request">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Calendar className="mr-2 h-5 w-5" />
                    Request Time Off
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button size="lg" className="w-full sm:w-auto">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create an Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-slide-up delay-300">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Request Time Off</h3>
            <p className="text-muted-foreground">Submit leave requests with just a few clicks and track their status in real-time.</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Team Calendar</h3>
            <p className="text-muted-foreground">View your team's availability at a glance with our intuitive calendar interface.</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Approval Workflow</h3>
            <p className="text-muted-foreground">Managers can easily approve or deny requests and provide feedback when needed.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
