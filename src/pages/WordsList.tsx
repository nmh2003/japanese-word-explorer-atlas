
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  getWordsByCategory, 
  getCategoryById, 
  paginate 
} from '@/data/dictionary';
import Pagination from '@/components/Pagination';
import { ChevronLeft } from 'lucide-react';

const WordsList = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 10 words per page
  
  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);
  
  const category = getCategoryById(categoryId || '');
  const allCategoryWords = getWordsByCategory(categoryId || '');
  
  const { items: paginatedWords, totalPages } = paginate(
    allCategoryWords,
    currentPage,
    pageSize
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (!category) {
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
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <span className="ml-2 text-3xl font-jp text-plum">{category.nameJp}</span>
        </div>
        <p className="text-muted-foreground mb-6">{category.description}</p>
      </div>
      
      <div className="space-y-4">
        {paginatedWords.map(word => (
          <Link to={`/words/${word.id}`} key={word.id}>
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="text-xl font-jp font-medium mr-3">{word.word}</h3>
                      <span className="text-sm text-muted-foreground">{word.reading}</span>
                    </div>
                    <p className="text-foreground">{word.meaning}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {word.jlpt}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
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
