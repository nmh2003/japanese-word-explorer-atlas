
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { getCategories, updateWord } from '@/lib/api';
import { Word } from '@/data/dictionary';
import { Loader2, Save } from 'lucide-react';

interface WordEditorProps {
  word: Word;
  onSaved: () => void;
  onCancel: () => void;
}

const WordEditor: React.FC<WordEditorProps> = ({ 
  word,
  onSaved,
  onCancel
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Word>>(word);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    setFormData(word);
  }, [word]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleChange = (
    field: keyof Word, 
    value: string | number | string[] | null
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const success = await updateWord(word.id, formData);
      if (success) {
        toast({
          title: "Thành công",
          description: "Cập nhật từ vựng thành công",
        });
        onSaved();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Failed to update word:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật từ vựng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chỉnh sửa từ vựng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="japanese" className="block text-sm font-medium">
                Từ vựng (Tiếng Nhật)
              </label>
              <Input
                id="japanese"
                value={formData.japanese || ''}
                onChange={(e) => handleChange('japanese', e.target.value)}
                className="font-jp"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Danh mục
              </label>
              <Select 
                value={formData.category || ''} 
                onValueChange={(value) => handleChange('category', value)}
              >
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
          </div>

          <div className="space-y-2">
            <label htmlFor="translation" className="block text-sm font-medium">
              Dịch nghĩa
            </label>
            <Textarea
              id="translation"
              value={formData.translation || ''}
              onChange={(e) => handleChange('translation', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="mnemonic" className="block text-sm font-medium">
              Mẹo nhớ
            </label>
            <Textarea
              id="mnemonic"
              value={formData.mnemonic || ''}
              onChange={(e) => handleChange('mnemonic', e.target.value)}
              rows={5}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Lưu
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WordEditor;
