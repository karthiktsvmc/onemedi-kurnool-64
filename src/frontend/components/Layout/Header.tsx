
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';
import { Button } from '@/shared/components/ui/button';
import { SmartSearchBar } from './SmartSearchBar';
import { MobileNav } from './MobileNav';
import { EnhancedLocationPicker } from './EnhancedLocationPicker';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // TODO: Implement search functionality
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">OM</span>
              </div>
              <span className="hidden font-bold sm:inline-block">ONE MEDI</span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 flex h-8 w-8 items-center justify-center md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open mobile menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-16">
            <MobileNav onClose={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Location Picker - Updated */}
        <div className="flex items-center space-x-4 mr-4">
          <EnhancedLocationPicker />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-4">
          <SmartSearchBar onSearch={handleSearch} />
        </div>

        {/* Action buttons */}
        <nav className="ml-auto flex items-center space-x-2">
          <Link to="/auth/sign-in">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/auth/sign-up">
            <Button size="sm">Sign Up</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
export { Header };
