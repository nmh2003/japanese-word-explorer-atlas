
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getCategories } from '@/lib/api';

const CategorySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleCategorySearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    const foundCategory = categories.find(category => 
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (foundCategory) {
      navigate(`/categories/${foundCategory}`);
      setSearchTerm(''); // Clear search after successful navigation
    } else {
      toast({
        title: "Không tìm thấy",
        description: `Không tìm thấy danh mục phù hợp với "${searchTerm}"`,
        variant: "destructive",
      });
    }
    
    setIsSearching(false);
  };

  return (
    <form onSubmit={handleCategorySearch} className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        type="search" 
        placeholder="Tìm danh mục..." 
        className="pl-8 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isSearching}
      />
    </form>
  );
};

export default CategorySearch;
