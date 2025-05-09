
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { addCategory, getCategories } from '@/lib/api';
import { Loader2, Plus } from 'lucide-react';

const CategoryManager = () => {
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh mục",
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên danh mục",
        variant: "destructive",
      });
      return;
    }
    
    if (categories.includes(categoryName)) {
      toast({
        title: "Lỗi",
        description: "Danh mục này đã tồn tại",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const success = await addCategory(categoryName);
      
      if (success) {
        toast({
          title: "Thành công",
          description: `Đã thêm danh mục "${categoryName}"`,
        });
        setCategoryName('');
        loadCategories(); // Reload the categories
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể thêm danh mục",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to add category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm danh mục",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm danh mục mới</CardTitle>
        <CardDescription>
          Tạo danh mục để phân loại từ vựng của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Input 
            placeholder="Tên danh mục" 
            value={categoryName} 
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button 
            onClick={handleAddCategory} 
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Thêm danh mục
          </Button>
        </div>
        
        {categories.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Danh mục hiện có:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <div key={index} className="px-3 py-1 bg-secondary rounded-md text-sm">
                  {category}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
