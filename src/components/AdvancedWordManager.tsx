
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

interface AdvancedWordManagerProps {
  onWordAdded?: (words: Word[]) => void;
}

interface CustomWordData {
  word: string;
  translation?: string;
  mnemonic?: string;
  image_url?: string;
  image_prompt?: string;
}

const AdvancedWordManager: React.FC<AdvancedWordManagerProps> = ({ onWordAdded }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [words, setWords] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Custom words for multiple word addition
  const [customWords, setCustomWords] = useState<CustomWordData[]>([
    { word: '' }
  ]);

  // JSON input
  const [jsonInput, setJsonInput] = useState<string>('');

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

  const handleAddCustomWords = async () => {
    const validWords = customWords.filter(w => w.word.trim());
    
    if (validWords.length === 0 || !selectedCategory) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ít nhất một từ vựng và chọn danh mục",
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
      
      const result = await addWordsWithCustomData(validWords, selectedCategory);
      toast({
        title: "Thành công",
        description: `Đã thêm ${result.length} từ vựng vào danh mục "${selectedCategory}"`,
      });
      
      // Reset form
      setCustomWords([{ word: '' }]);
      
      if (onWordAdded) {
        onWordAdded(result);
      }
    } catch (error) {
      console.error("Failed to add custom words:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm từ vựng tùy chỉnh",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddJsonWords = async () => {
    if (!jsonInput.trim() || !selectedCategory) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập JSON và chọn danh mục",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedWords = JSON.parse(jsonInput);
      if (!Array.isArray(parsedWords)) {
        throw new Error("JSON phải là một array");
      }

      setIsLoading(true);
      toast({
        title: "Đang xử lý",
        description: "Đang thêm từ vựng từ JSON.",
      });
      
      const result = await addWordsWithCustomData(parsedWords, selectedCategory);
      toast({
        title: "Thành công",
        description: `Đã thêm ${result.length} từ vựng vào danh mục "${selectedCategory}"`,
      });
      
      setJsonInput('');
      
      if (onWordAdded) {
        onWordAdded(result);
      }
    } catch (error) {
      console.error("Failed to add JSON words:", error);
      toast({
        title: "Lỗi",
        description: "JSON không hợp lệ hoặc không thể thêm từ vựng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomWordRow = () => {
    setCustomWords([...customWords, { word: '' }]);
  };

  const removeCustomWordRow = (index: number) => {
    if (customWords.length > 1) {
      const newCustomWords = customWords.filter((_, i) => i !== index);
      setCustomWords(newCustomWords);
    }
  };

  const updateCustomWord = (index: number, field: keyof CustomWordData, value: string) => {
    const newCustomWords = [...customWords];
    newCustomWords[index] = { ...newCustomWords[index], [field]: value };
    setCustomWords(newCustomWords);
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="auto">Tự động</TabsTrigger>
              <TabsTrigger value="custom">Tùy chỉnh</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
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
                  Thêm nhiều từ vậng với tùy chỉnh khác nhau cho từng từ. Các trường để trống sẽ được hệ thống tự động tạo.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {customWords.map((customWord, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Từ vựng #{index + 1}</h4>
                      {customWords.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomWordRow(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Từ vựng tiếng Nhật *
                        </label>
                        <Input
                          value={customWord.word}
                          onChange={(e) => updateCustomWord(index, 'word', e.target.value)}
                          placeholder="ví dụ: わたし"
                          className="font-jp"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          URL hình ảnh
                        </label>
                        <Input
                          value={customWord.image_url || ''}
                          onChange={(e) => updateCustomWord(index, 'image_url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Dịch nghĩa
                      </label>
                      <Textarea
                        value={customWord.translation || ''}
                        onChange={(e) => updateCustomWord(index, 'translation', e.target.value)}
                        placeholder="Để trống để hệ thống tự động dịch"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Mẹo nhớ
                      </label>
                      <Textarea
                        value={customWord.mnemonic || ''}
                        onChange={(e) => updateCustomWord(index, 'mnemonic', e.target.value)}
                        placeholder="Để trống để hệ thống tự động tạo"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Mô tả hình ảnh
                      </label>
                      <Textarea
                        value={customWord.image_prompt || ''}
                        onChange={(e) => updateCustomWord(index, 'image_prompt', e.target.value)}
                        placeholder="Mô tả cho việc tạo hình ảnh"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomWordRow}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm từ vựng
                </Button>

                <Button 
                  onClick={handleAddCustomWords} 
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
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <Alert className="bg-purple-50">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Chế độ JSON</AlertTitle>
                <AlertDescription>
                  Thêm từ vựng bằng cách nhập JSON trực tiếp. Ví dụ format:
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`[
  {
    "word": "おきます",
    "translation": "Word: おきます\\nTranslation: get up, wake up"
  },
  {
    "word": "ねます"
  },
  {
    "word": "こんにちは",
    "translation": "Word: こんにちは\\nTranslation: Hello",
    "mnemonic": "Say 'Konnichiwa' to be convivial."
  }
]`}
                  </pre>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label htmlFor="json" className="block text-sm font-medium">
                  JSON Data
                </label>
                <Textarea
                  id="json"
                  placeholder="Nhập JSON array của từ vựng..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <Button 
                onClick={handleAddJsonWords} 
                disabled={isLoading} 
                className="w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Đang xử lý..." : "Thêm từ vựng từ JSON"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedWordManager;
