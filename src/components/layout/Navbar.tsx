
import { Link, useLocation } from "react-router-dom";
import { Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                Daily Reporter
              </Link>
            </div>
            <nav className="ml-10 flex items-center space-x-4">
              <Link
                to="/report"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2",
                  isActive("/report")
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-primary"
                )}
              >
                <FileText className="h-4 w-4" />
                Submit Report
              </Link>
              <Link
                to="/dashboard"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2",
                  isActive("/dashboard")
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-primary"
                )}
              >
                <Calendar className="h-4 w-4" />
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
