
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCategories, getWordsByCategory } from '@/lib/api';
import { paginate } from '@/data/dictionary';
import { Word } from '@/data/dictionary';
import Pagination from '@/components/Pagination';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const WordsList = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const pageSize = 10; // 10 words per page
  
  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
    loadWords();
  }, [categoryId]);
  
  const loadWords = async () => {
    if (!categoryId) return;
    
    try {
      setIsLoading(true);
      const data = await getWordsByCategory(categoryId);
      setWords(data);
    } catch (error) {
      console.error("Failed to load words:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách từ vựng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const { items: paginatedWords, totalPages } = paginate(
    words,
    currentPage,
    pageSize
  );
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-plum border-r-transparent"></div>
          <p className="mt-2">Đang tải...</p>
        </div>
      </div>
    );
  }
  
  if (!categoryId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy danh mục</h2>
        <Button asChild variant="outline">
          <Link to="/categories">Quay lại danh mục</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center mb-2">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link to="/categories">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Danh mục
          </Link>
        </Button>
      </div>
      
      <div>
        <div className="flex items-center mb-1">
          <h1 className="text-3xl font-bold">{categoryId}</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Danh sách từ vựng trong danh mục {categoryId}
        </p>
      </div>
      
      <div className="space-y-4">
        {paginatedWords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có từ vựng nào trong danh mục này
          </div>
        ) : (
          paginatedWords.map(word => (
            <Link to={`/words/${word.id}`} key={word.id}>
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="text-xl font-jp font-medium mr-3">{word.japanese}</h3>
                        {word.reading && <span className="text-sm text-muted-foreground">{word.reading}</span>}
                      </div>
                      <p className="text-foreground">
                        {word.translation && word.translation.includes('Translation:') ? 
                          word.translation.split('Translation:')[1].split('(')[0].trim() : 
                          word.meaning || word.translation}
                      </p>
                    </div>
                    
                    {word.jlpt && (
                      <div className="flex items-center">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {word.jlpt}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
};

export default WordsList;
