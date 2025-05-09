
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  getWordById, 
  getCategoryById 
} from '@/data/dictionary';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const WordDetail = () => {
  const { wordId } = useParams<{ wordId: string }>();
  const word = getWordById(wordId || '');
  const category = word ? getCategoryById(word.categoryId) : undefined;
  
  if (!word || !category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy từ vựng</h2>
        <Button asChild variant="outline">
          <Link to="/categories">Quay lại danh mục</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center mb-2">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link to={`/categories/${category.id}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {category.name}
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-4xl font-jp">{word.word}</CardTitle>
                <Badge variant="outline">{word.jlpt}</Badge>
              </div>
              <CardDescription className="text-lg">{word.reading}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Nghĩa</h3>
            <p className="text-xl">{word.meaning}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Ví dụ</h3>
            <div className="space-y-4">
              {word.examples.map((example, index) => (
                <div key={index} className="bg-secondary/50 p-4 rounded-md">
                  <p className="text-lg font-jp mb-1">{example.japanese}</p>
                  <p className="text-muted-foreground text-sm mb-2">{example.reading}</p>
                  <p className="text-foreground">{example.translation}</p>
                </div>
              ))}
            </div>
          </div>
          
          {word.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Thẻ</h3>
              <div className="flex flex-wrap gap-2">
                {word.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WordDetail;
