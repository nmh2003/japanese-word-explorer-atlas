
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getWords, deleteWord } from '@/lib/api';
import { Word } from '@/data/dictionary';
import { paginate } from '@/data/dictionary';
import Pagination from '@/components/Pagination';
import { Trash2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WordListProps {
  category?: string;
  refreshTrigger?: number;
  onEdit?: (word: Word) => void;
}

const WordList: React.FC<WordListProps> = ({ 
  category,
  refreshTrigger = 0,
  onEdit
}) => {
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteWordId, setDeleteWordId] = useState<string | null>(null);
  const { toast } = useToast();
  const pageSize = 10;

  useEffect(() => {
    loadWords();
  }, [refreshTrigger]);

  useEffect(() => {
    if (category) {
      setFilteredWords(words.filter(word => word.category === category));
      setCurrentPage(1);
    } else {
      setFilteredWords(words);
    }
  }, [words, category]);

  const loadWords = async () => {
    try {
      setIsLoading(true);
      const data = await getWords();
      setWords(data);
    } catch (error) {
      console.error("Failed to load words:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách từ vựng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteWordId(id);
  };

  const confirmDelete = async () => {
    if (!deleteWordId) return;
    
    try {
      const success = await deleteWord(deleteWordId);
      if (success) {
        toast({
          title: "Thành công",
          description: "Đã xóa từ vựng",
        });
        setWords(prev => prev.filter(word => word.id !== deleteWordId));
      }
    } catch (error) {
      console.error("Failed to delete word:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa từ vựng",
        variant: "destructive",
      });
    } finally {
      setDeleteWordId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteWordId(null);
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách từ vựng</CardTitle>
          {category && (
            <CardDescription>Danh mục: {category}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Từ vựng</TableHead>
                  <TableHead>Dịch nghĩa</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : paginatedWords.length > 0 ? (
                  paginatedWords.map((word, index) => (
                    <TableRow key={word.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell className="font-jp">{word.japanese}</TableCell>
                      <TableCell>
                        {word.translation && word.translation.includes('Translation:') ? 
                          word.translation.split('Translation:')[1].split('(')[0].trim() : 
                          word.meaning || word.translation}
                      </TableCell>
                      <TableCell>{word.category}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {onEdit && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onEdit(word)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(word.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Chưa có từ vựng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteWordId} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa từ vựng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WordList;
