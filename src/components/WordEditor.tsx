
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Word } from '@/data/dictionary';
import { updateWord } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface WordEditorProps {
  word: Word;
  onSaved: () => void;
  onCancel: () => void;
}

const WordEditor: React.FC<WordEditorProps> = ({ word, onSaved, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Word>>({
    japanese: word.japanese,
    translation: word.translation,
    mnemonic: word.mnemonic,
    image_url: word.image_url,
    image_prompt: word.image_prompt,
    category: word.category,
    jlpt: word.jlpt,
    reading: word.reading,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await updateWord(word.id, formData);
      if (success) {
        toast({
          title: "Thành công",
          description: "Cập nhật từ vựng thành công",
        });
        onSaved();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật từ vựng",
          variant: "destructive",
        });
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
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="japanese" className="block text-sm font-medium mb-1">
                Từ vựng tiếng Nhật
              </label>
              <Input
                id="japanese"
                name="japanese"
                value={formData.japanese}
                onChange={handleChange}
                className="font-jp"
                required
              />
            </div>
            
            <div>
              <label htmlFor="reading" className="block text-sm font-medium mb-1">
                Cách đọc (Furigana)
              </label>
              <Input
                id="reading"
                name="reading"
                value={formData.reading || ''}
                onChange={handleChange}
                className="font-jp"
              />
            </div>

            <div>
              <label htmlFor="translation" className="block text-sm font-medium mb-1">
                Dịch nghĩa
              </label>
              <Textarea
                id="translation"
                name="translation"
                value={formData.translation}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div>
              <label htmlFor="mnemonic" className="block text-sm font-medium mb-1">
                Mẹo nhớ
              </label>
              <Textarea
                id="mnemonic"
                name="mnemonic"
                value={formData.mnemonic}
                onChange={handleChange}
                rows={5}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Danh mục
              </label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="jlpt" className="block text-sm font-medium mb-1">
                Cấp độ JLPT (N5, N4, N3, N2, N1)
              </label>
              <Input
                id="jlpt"
                name="jlpt"
                value={formData.jlpt || ''}
                onChange={handleChange}
                placeholder="Ví dụ: N5"
              />
            </div>

            <div>
              <label htmlFor="image_prompt" className="block text-sm font-medium mb-1">
                Mô tả hình ảnh
              </label>
              <Textarea
                id="image_prompt"
                name="image_prompt"
                value={formData.image_prompt || ''}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium mb-1">
                URL Hình ảnh
              </label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
              />
              {formData.image_url && (
                <div className="mt-2 aspect-square w-32 h-32 overflow-hidden rounded-md bg-secondary">
                  <img
                    src={formData.image_url.startsWith('http') ? formData.image_url : `http://localhost:5000/${formData.image_url}`}
                    alt={formData.japanese}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu thay đổi
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WordEditor;
