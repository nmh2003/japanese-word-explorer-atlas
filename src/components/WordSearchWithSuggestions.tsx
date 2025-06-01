
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getWords } from '@/lib/api';
import { Word } from '@/data/dictionary';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const WordSearchWithSuggestions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const wordsData = await getWords();
      setWords(wordsData);
    } catch (error) {
      console.error("Failed to load words:", error);
    }
  };

  const getFilteredWords = () => {
    if (!searchTerm.trim()) return [];
    
    const filtered = words.filter(word => {
      // Search by Japanese word
      if (word.japanese.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      
      // Search by translation/meaning
      if (word.translation) {
        const mainTranslation = word.translation.includes('Translation:') ? 
          word.translation.split('Translation:')[1].split('(')[0].trim() : 
          word.translation;
        
        if (mainTranslation.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
        
        if (word.translation.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
      }
      
      return false;
    });

    // Limit to 5 suggestions
    return filtered.slice(0, 5);
  };

  const handleSelectWord = (word: Word) => {
    navigate(`/words/${word.id}`);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    
    const filteredWords = getFilteredWords();
    if (filteredWords.length > 0) {
      handleSelectWord(filteredWords[0]);
    } else {
      toast({
        title: "Không tìm thấy",
        description: `Không tìm thấy từ vựng phù hợp với "${searchTerm}"`,
        variant: "destructive",
      });
    }
  };

  const filteredWords = getFilteredWords();

  return (
    <Popover open={isOpen && filteredWords.length > 0} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            ref={inputRef}
            type="search" 
            placeholder="Tìm từ hoặc nghĩa..." 
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(e.target.value.trim().length > 0);
            }}
            onFocus={() => {
              if (searchTerm.trim().length > 0) {
                setIsOpen(true);
              }
            }}
            disabled={isLoading}
          />
        </form>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>Không tìm thấy từ vựng.</CommandEmpty>
            <CommandGroup>
              {filteredWords.map((word) => (
                <CommandItem
                  key={word.id}
                  onSelect={() => {
                    handleSelectWord(word);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-jp font-medium">{word.japanese}</span>
                    <span className="text-sm text-muted-foreground">
                      {word.translation?.includes('Translation:') 
                        ? word.translation.split('Translation:')[1].split('(')[0].trim()
                        : word.translation?.substring(0, 50) + (word.translation?.length > 50 ? '...' : '')
                      }
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default WordSearchWithSuggestions;
