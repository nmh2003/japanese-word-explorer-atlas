
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Navbar = () => {
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
        
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/categories" className="font-medium text-muted-foreground hover:text-foreground transition-colors">
            Danh mục
          </Link>
          <Button asChild variant="default" className="bg-plum hover:bg-plum/90">
            <Link to="/categories">Khám phá</Link>
          </Button>
        </nav>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </Button>
      </div>
      
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
