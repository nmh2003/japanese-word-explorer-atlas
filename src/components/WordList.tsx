
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Word } from '@/data/dictionary';
import { getWords, deleteWord, getCategories } from '@/lib/api';
import { paginate } from '@/data/dictionary';
import Pagination from '@/components/Pagination';
import { Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WordListProps {
  refreshTrigger?: number;
  onEdit?: (word: Word) => void;
}

const WordList: React.FC<WordListProps> = ({ refreshTrigger = 0, onEdit }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');  // Changed from empty string to 'all'
  const [categories, setCategories] = useState<string[]>([]);
  const [deletingWordId, setDeletingWordId] = useState<string | null>(null);
  const pageSize = 10;
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch words when component mounts or refreshTrigger changes
  useEffect(() => {
    fetchWords();
  }, [refreshTrigger]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter words when filter or search term changes
  useEffect(() => {
    filterWords();
  }, [searchTerm, filter, words]);

  const fetchWords = async () => {
    setIsLoading(true);
    try {
      const data = await getWords();
      setWords(data);
    } catch (error) {
      console.error("Failed to fetch words:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách từ vựng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const filterWords = () => {
    let filtered = [...words];

    // Apply category filter
    if (filter && filter !== 'all') {  // Updated condition to check for 'all'
      filtered = filtered.filter(word => word.category === filter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(word => 
        word.japanese.toLowerCase().includes(term) || 
        word.translation.toLowerCase().includes(term)
      );
    }

    setFilteredWords(filtered);
    setCurrentPage(1);
  };

  const handleDeleteWord = async (id: string) => {
    setDeletingWordId(id);
    try {
      const success = await deleteWord(id);
      if (success) {
        setWords(words.filter(word => word.id !== id));
        toast({
          title: "Thành công",
          description: "Đã xóa từ vựng",
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể xóa từ vựng",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete word:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa từ vựng",
        variant: "destructive",
      });
    } finally {
      setDeletingWordId(null);
    }
  };

  const handleViewWord = (wordId: string) => {
    navigate(`/words/${wordId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { items: paginatedWords, totalPages } = paginate(
    filteredWords,
    currentPage,
    pageSize
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách từ vựng</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo từ vựng hoặc nghĩa..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>  {/* Changed empty string to 'all' */}
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Words list */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-plum border-r-transparent"></div>
            <p className="ml-2">Đang tải từ vựng...</p>
          </div>
        ) : (
          <>
            {paginatedWords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || filter ? "Không tìm thấy từ vựng phù hợp" : "Chưa có từ vựng nào"}
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Từ vựng</TableHead>
                      <TableHead>Nghĩa</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedWords.map((word) => (
                      <TableRow key={word.id}>
                        <TableCell>
                          <div className="font-medium font-jp">
                            {word.japanese}
                          </div>
                        </TableCell>
                        <TableCell>
                          {word.translation && word.translation.includes('Translation:') ? 
                            word.translation.split('Translation:')[1].split('(')[0].trim() : 
                            word.meaning || word.translation}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{word.category}</Badge>
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewWord(word.id)}
                          >
                            Xem
                          </Button>
                          {onEdit && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onEdit(word)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteWord(word.id)}
                            disabled={deletingWordId === word.id}
                          >
                            {deletingWordId === word.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WordList;
