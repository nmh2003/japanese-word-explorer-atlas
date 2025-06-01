
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { addCategory, getCategories, deleteCategory } from '@/lib/api';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const CategoryManager = () => {
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
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
        loadCategories();
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

  const handleDeleteCategory = async (categoryToDelete: string) => {
    try {
      setDeletingCategory(categoryToDelete);
      const result = await deleteCategory(categoryToDelete);
      
      if (result.success) {
        toast({
          title: "Thành công",
          description: `Đã xóa danh mục "${categoryToDelete}"${result.deleted_words_count ? ` và ${result.deleted_words_count} từ vựng` : ''}`,
        });
        loadCategories();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể xóa danh mục",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa danh mục",
        variant: "destructive",
      });
    } finally {
      setDeletingCategory(null);
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
        <CardTitle>Quản lý danh mục</CardTitle>
        <CardDescription>
          Tạo và quản lý danh mục để phân loại từ vựng của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
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
          <div>
            <h3 className="text-sm font-medium mb-3">Danh mục hiện có:</h3>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-2 bg-secondary rounded-md">
                  <span className="text-sm">{category}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deletingCategory === category}
                      >
                        {deletingCategory === category ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xóa danh mục "{category}"? 
                          Tất cả từ vựng trong danh mục này cũng sẽ bị xóa. 
                          Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteCategory(category)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
