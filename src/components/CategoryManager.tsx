
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addCategory } from '@/lib/api';
import { Loader2, Plus } from 'lucide-react';

const CategoryManager = () => {
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên danh mục",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm danh mục mới</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Input 
            placeholder="Tên danh mục" 
            value={categoryName} 
            onChange={(e) => setCategoryName(e.target.value)}
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
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
