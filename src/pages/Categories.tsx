
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { getCategories, getWords } from '@/lib/api';
import { paginate } from '@/data/dictionary';
import Pagination from '@/components/Pagination';
import { useToast } from '@/components/ui/use-toast';

const Categories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const pageSize = 8; // 8 categories per page
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      // Load categories and words to get counts
      const categoriesData = await getCategories();
      const wordsData = await getWords();
      
      // Calculate word count for each category
      const counts: Record<string, number> = {};
      categoriesData.forEach(category => {
        counts[category] = wordsData.filter(word => word.category === category).length;
      });
      
      setCategories(categoriesData);
      setWordCounts(counts);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu danh mục",
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
  
  const { items: paginatedCategories, totalPages } = paginate(
    categories,
    currentPage,
    pageSize
  );
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-plum border-r-transparent"></div>
          <p className="mt-2">Đang tải danh mục...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Danh mục từ vựng tiếng Nhật</h1>
        <p className="text-muted-foreground">
          Khám phá từ vựng tiếng Nhật theo chủ đề. Chọn một danh mục để xem danh sách từ vựng.
        </p>
      </div>
      
      {categories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có danh mục nào. Hãy thêm danh mục trong trang quản trị.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedCategories.map(category => (
            <Link to={`/categories/${category}`} key={category}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                <div className="h-24 bg-secondary flex items-center justify-center">
                  <span className="text-3xl font-jp font-bold text-plum">{category}</span>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-1">{category}</h3>
                  <div className="text-xs font-medium text-muted-foreground">
                    {wordCounts[category] || 0} từ vựng
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
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

export default Categories;
