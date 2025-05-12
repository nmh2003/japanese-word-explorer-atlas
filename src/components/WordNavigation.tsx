
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Word } from '@/data/dictionary';

interface WordNavigationProps {
  currentWordId: string;
  category: string;
  words: Word[];
}

const WordNavigation: React.FC<WordNavigationProps> = ({ currentWordId, category, words }) => {
  const [prevWord, setPrevWord] = useState<Word | null>(null);
  const [nextWord, setNextWord] = useState<Word | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (words.length === 0) return;
    
    // Find the current word index
    const currentIndex = words.findIndex(word => word.id === currentWordId);
    if (currentIndex === -1) return;
    
    // Set previous word
    if (currentIndex > 0) {
      setPrevWord(words[currentIndex - 1]);
    } else {
      setPrevWord(null);
    }
    
    // Set next word
    if (currentIndex < words.length - 1) {
      setNextWord(words[currentIndex + 1]);
    } else {
      setNextWord(null);
    }
  }, [currentWordId, words]);

  return (
    <div className="flex justify-between items-center w-full gap-2">
      <Button 
        variant="outline" 
        onClick={() => prevWord && navigate(`/words/${prevWord.id}`)}
        disabled={!prevWord}
        className="flex-1 sm:flex-initial"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Từ trước
      </Button>
      
      <Button
        variant="outline"
        asChild
        className="flex-initial"
      >
        <a href={`/categories/${category}`}>
          Quay lại
        </a>
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => nextWord && navigate(`/words/${nextWord.id}`)}
        disabled={!nextWord}
        className="flex-1 sm:flex-initial"
      >
        Từ sau
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default WordNavigation;
