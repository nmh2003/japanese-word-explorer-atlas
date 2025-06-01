
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCategories, addWords, addWordsWithCustomData } from '@/lib/api';
import { Word } from '@/data/dictionary';
import { Loader2, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

interface AdvancedWordManagerProps {
  onWordAdded?: (words: Word[]) => void;
}

const AdvancedWordManager: React.FC<AdvancedWordManagerProps> = ({ onWordAdded }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [words, setWords] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Custom word form
  const [customWordData, setCustomWordData] = useState({
    japanese: '',
    translation: '',
    mnemonic: '',
    image_url: '',
    image_prompt: ''
  });

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
      toast({
        title: "Đang xử lý",
        description: "Đang thêm và xử lý từ vựng. Quá trình này có thể mất một chút thời gian.",
      });
      
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

  const handleAddCustomWord = async () => {
    if (!customWordData.japanese.trim() || !selectedCategory) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ít nhất từ vựng tiếng Nhật và chọn danh mục",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      toast({
        title: "Đang xử lý",
        description: "Đang thêm từ vựng tùy chỉnh.",
      });

      const wordData = {
        word: customWordData.japanese,
        ...(customWordData.translation && { translation: customWordData.translation }),
        ...(customWordData.mnemonic && { mnemonic: customWordData.mnemonic }),
        ...(customWordData.image_url && { image_url: customWordData.image_url }),
        ...(customWordData.image_prompt && { image_prompt: customWordData.image_prompt })
      };
      
      const result = await addWordsWithCustomData([wordData], selectedCategory);
      toast({
        title: "Thành công",
        description: `Đã thêm từ vựng "${customWordData.japanese}" vào danh mục "${selectedCategory}"`,
      });
      
      // Reset form
      setCustomWordData({
        japanese: '',
        translation: '',
        mnemonic: '',
        image_url: '',
        image_prompt: ''
      });
      
      if (onWordAdded) {
        onWordAdded(result);
      }
    } catch (error) {
      console.error("Failed to add custom word:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm từ vựng tùy chỉnh",
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
        <CardDescription>
          Hệ thống sẽ tự động dịch nghĩa, tạo mẹo nhớ, và tạo hình ảnh minh họa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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

          <Tabs defaultValue="auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="auto">Tự động</TabsTrigger>
              <TabsTrigger value="custom">Tùy chỉnh</TabsTrigger>
            </TabsList>
            
            <TabsContent value="auto" className="space-y-4">
              <Alert className="bg-blue-50">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Chế độ tự động</AlertTitle>
                <AlertDescription>
                  Khi thêm từ vựng, hệ thống sẽ tự động:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Dịch nghĩa từ tiếng Nhật sang tiếng Việt</li>
                    <li>Tạo mẹo nhớ (mnemonic) sáng tạo</li>
                    <li>Tạo hình ảnh minh họa từ mẹo nhớ</li>
                    <li>Tạo file âm thanh phát âm</li>
                  </ul>
                </AlertDescription>
              </Alert>

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
                {isLoading ? "Đang xử lý..." : "Thêm từ vựng tự động"}
              </Button>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <Alert className="bg-green-50">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Chế độ tùy chỉnh</AlertTitle>
                <AlertDescription>
                  Bạn có thể tự định nghĩa một số thông tin của từ vựng. Các trường để trống sẽ được hệ thống tự động tạo.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Từ vựng tiếng Nhật *
                  </label>
                  <Input
                    value={customWordData.japanese}
                    onChange={(e) => setCustomWordData(prev => ({ ...prev, japanese: e.target.value }))}
                    placeholder="ví dụ: わたし"
                    className="font-jp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Dịch nghĩa (tùy chọn)
                  </label>
                  <Textarea
                    value={customWordData.translation}
                    onChange={(e) => setCustomWordData(prev => ({ ...prev, translation: e.target.value }))}
                    placeholder="Để trống để hệ thống tự động dịch"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mẹo nhớ (tùy chọn)
                  </label>
                  <Textarea
                    value={customWordData.mnemonic}
                    onChange={(e) => setCustomWordData(prev => ({ ...prev, mnemonic: e.target.value }))}
                    placeholder="Để trống để hệ thống tự động tạo"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL hình ảnh (tùy chọn)
                  </label>
                  <Input
                    value={customWordData.image_url}
                    onChange={(e) => setCustomWordData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="Để trống để hệ thống tự động tạo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mô tả hình ảnh (tùy chọn)
                  </label>
                  <Textarea
                    value={customWordData.image_prompt}
                    onChange={(e) => setCustomWordData(prev => ({ ...prev, image_prompt: e.target.value }))}
                    placeholder="Mô tả cho việc tạo hình ảnh"
                    rows={2}
                  />
                </div>
              </div>

              <Button 
                onClick={handleAddCustomWord} 
                disabled={isLoading} 
                className="w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Đang xử lý..." : "Thêm từ vựng tùy chỉnh"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedWordManager;
