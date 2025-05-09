
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { getCategories, addWords } from '@/lib/api';
import { Word } from '@/data/dictionary';
import { Loader2, Plus } from 'lucide-react';

interface WordManagerProps {
  onWordAdded?: (words: Word[]) => void;
}

const WordManager: React.FC<WordManagerProps> = ({ onWordAdded }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [words, setWords] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0]);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách danh mục",
        variant: "destructive",
      });
    }
  };

  const handleAddWords = async () => {
    if (!words.trim() || !selectedCategory) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập từ vựng và chọn danh mục",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await addWords(words, selectedCategory);
      toast({
        title: "Thành công",
        description: `Đã thêm ${result.length} từ vựng vào danh mục "${selectedCategory}"`,
      });
      setWords('');
      if (onWordAdded) {
        onWordAdded(result);
      }
    } catch (error) {
      console.error("Failed to add words:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm từ vựng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm từ vựng mới</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium">
              Danh mục
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="words" className="block text-sm font-medium">
              Từ vựng (mỗi từ một dòng hoặc phân cách bởi dấu phẩy)
            </label>
            <Textarea
              id="words"
              placeholder="Nhập từ vựng tiếng Nhật..."
              value={words}
              onChange={(e) => setWords(e.target.value)}
              rows={5}
              className="font-jp"
            />
          </div>

          <Button 
            onClick={handleAddWords} 
            disabled={isLoading} 
            className="w-full flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Thêm từ vựng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordManager;
