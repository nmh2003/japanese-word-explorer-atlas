
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Book, Plus, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-jp font-bold text-2xl text-plum">辞書</span>
          <span className="font-bold text-xl text-inkBlack">JishoDict</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6 flex-1 justify-center max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Tìm từ..." 
              className="pl-8 w-full"
            />
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/categories" className="font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center">
            <Book className="h-4 w-4 mr-1" />
            Danh mục
          </Link>
          <Button asChild variant="default" className="bg-plum hover:bg-plum/90">
            <Link to="/admin" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Quản trị
            </Link>
          </Button>
        </nav>
        
        {/* Mobile Navigation Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 border-t border-border space-y-4">
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/categories" className="flex items-center justify-center">
                <Book className="h-4 w-4 mr-1" />
                Danh mục
              </Link>
            </Button>
            <Button asChild variant="default" className="flex-1 bg-plum hover:bg-plum/90">
              <Link to="/admin" className="flex items-center justify-center">
                <Plus className="h-4 w-4 mr-1" />
                Quản trị
              </Link>
            </Button>
          </div>
        </div>
      )}
      
      {/* Mobile Search Bar (always visible) */}
      <div className="md:hidden px-4 py-2 border-t border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Tìm từ..." 
            className="pl-8 w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
