
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-4">
      <div className="text-center space-y-6 max-w-lg animate-fade-in">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full"></div>
        <h2 className="text-2xl font-medium mt-4">Stream Not Found</h2>
        <p className="text-muted-foreground">
          The stream you're looking for doesn't exist or may have ended. Please check the URL or return to the home page.
        </p>
        
        <Button asChild size="lg" className="mt-6 animate-slide-up">
          <Link to="/" className="flex items-center gap-2">
            <Home size={18} />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
