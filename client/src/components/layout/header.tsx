import { Link, useLocation } from "wouter";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import Navigation from "./navigation";

const Header = () => {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/">
                  <h1 className="text-xl font-bold text-primary cursor-pointer">BisnisKu</h1>
                </Link>
              </div>
              {!isMobile && (
                <nav className="ml-8 flex space-x-8">
                  <Navigation />
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">BU</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Budi Santoso</span>
              </div>
              
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64">
                    <div className="py-6">
                      <Navigation />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {isMobile && (
        <nav className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex space-x-8 overflow-x-auto">
            <Navigation />
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
