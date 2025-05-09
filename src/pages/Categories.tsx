
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { categories, paginate } from '@/data/dictionary';
import Pagination from '@/components/Pagination';

const Categories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // 8 categories per page
  
  const { items: paginatedCategories, totalPages } = paginate(
    categories,
    currentPage,
    pageSize
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Danh mục từ vựng tiếng Nhật</h1>
        <p className="text-muted-foreground">
          Khám phá từ vựng tiếng Nhật theo chủ đề. Chọn một danh mục để xem danh sách từ vựng.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedCategories.map(category => (
          <Link to={`/categories/${category.id}`} key={category.id}>
            <Card className="overflow-hidden h-full transition-all hover:shadow-md">
              <div className="h-24 bg-secondary flex items-center justify-center">
                <span className="text-3xl font-jp font-bold text-plum">{category.nameJp}</span>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{category.description}</p>
                <div className="text-xs font-medium text-muted-foreground">
                  {category.wordCount} từ vựng
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

export default Categories;
