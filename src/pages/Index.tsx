
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getCategories, getWords } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Search } from 'lucide-react';
import { Word } from '@/data/dictionary';

const Index = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCategories();
    fetchWords();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh mục từ vựng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchWords = async () => {
    try {
      const wordsData = await getWords();
      setWords(wordsData);
    } catch (error) {
      console.error("Failed to load words:", error);
      // No toast needed here as it's background loading
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    const foundWord = words.find(word => 
      word.japanese.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (word.translation && word.translation.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (foundWord) {
      navigate(`/words/${foundWord.id}`);
    } else {
      toast({
        title: "Không tìm thấy",
        description: `Không tìm thấy từ vựng phù hợp với "${searchTerm}"`,
        variant: "destructive",
      });
    }
    setIsSearching(false);
  };
  
  // Display just the first 6 categories on the homepage
  const featuredCategories = categories.slice(0, 6);
  
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-plum">Từ điển</span> Tiếng Nhật Việt
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Khám phá và học hàng ngàn từ vựng tiếng Nhật với phát âm, ví dụ và cách sử dụng chính xác.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-plum hover:bg-plum/90">
            <Link to="/categories">Khám phá danh mục</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#">Học hôm nay</a>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Tìm kiếm từ vựng</h2>
        <p className="text-muted-foreground mb-4">
          Khám phá từ vựng tiếng Nhật theo chủ đề. Chọn một danh mục để xem danh sách từ vựng.
        </p>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Nhập từ vựng hoặc nghĩa để tìm kiếm..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            className="bg-plum hover:bg-plum/90"
            disabled={isSearching || !searchTerm.trim()}
          >
            Tìm kiếm
          </Button>
        </form>
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Danh mục phổ biến</h2>
          <Button asChild variant="ghost" className="text-plum">
            <Link to="/categories">Xem tất cả</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-plum border-r-transparent"></div>
            <p className="ml-2">Đang tải danh mục...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map(category => (
              <Link to={`/categories/${category}`} key={category}>
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <div className="h-32 bg-secondary flex items-center justify-center">
                    <span className="text-4xl font-jp font-bold text-plum">{category}</span>
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-1">{category}</h3>
                    <p className="text-muted-foreground text-sm mb-3">Từ vựng liên quan đến chủ đề {category}</p>
                    <div className="text-xs font-medium text-muted-foreground">
                      Khám phá từ vựng
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Bắt đầu học <span className="text-plum">ngay hôm nay</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Với hơn 200+ từ vựng và ví dụ thực tế, hãy nâng cao vốn từ vựng tiếng Nhật của bạn một cách hiệu quả.
        </p>
        <Button asChild size="lg" className="bg-plum hover:bg-plum/90">
          <Link to="/categories">Bắt đầu học ngay</Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;
