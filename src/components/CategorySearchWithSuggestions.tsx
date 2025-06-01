
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCategories } from '@/lib/api';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CategorySearchWithSuggestions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
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

  const getFilteredCategories = () => {
    if (!searchTerm.trim()) return [];
    
    const filtered = categories.filter(category => 
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Limit to 5 suggestions
    return filtered.slice(0, 5);
  };

  const handleSelectCategory = (category: string) => {
    navigate(`/categories/${category}`);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    
    const filteredCategories = getFilteredCategories();
    if (filteredCategories.length > 0) {
      handleSelectCategory(filteredCategories[0]);
    } else {
      toast({
        title: "Không tìm thấy",
        description: `Không tìm thấy danh mục phù hợp với "${searchTerm}"`,
        variant: "destructive",
      });
    }
  };

  const filteredCategories = getFilteredCategories();

  return (
    <Popover open={isOpen && filteredCategories.length > 0} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Tìm danh mục..." 
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
        </form>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
            <CommandGroup>
              {filteredCategories.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => handleSelectCategory(category)}
                  className="cursor-pointer"
                >
                  <span>{category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySearchWithSuggestions;
