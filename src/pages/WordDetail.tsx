import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { ChevronLeft, Volume } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Word } from '@/data/dictionary';
import { getWords } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const WordDetail = () => {
  const { wordId } = useParams<{ wordId: string }>();
  const [word, setWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { toast } = useToast();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    loadWord();
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [wordId]);
  
  const loadWord = async () => {
    try {
      setIsLoading(true);
      const words = await getWords();
      const foundWord = words.find(w => w.id === wordId);
      if (foundWord) {
        setWord(foundWord);
        
        // Preload audio if available
        if (foundWord.audio_file) {
          const newAudio = new Audio(`http://localhost:5000/audio/${foundWord.audio_file}`);
          newAudio.addEventListener('ended', () => setIsPlaying(false));
          setAudio(newAudio);
        }
      }
    } catch (error) {
      console.error("Failed to load word:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin từ vựng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePlayAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      } else {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error("Error playing audio:", error);
            toast({
              title: "Lỗi",
              description: "Không thể phát âm thanh",
              variant: "destructive",
            });
          });
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-plum border-r-transparent"></div>
          <p className="mt-2">Đang tải...</p>
        </div>
      </div>
    );
  }
  
  if (!word) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy từ vựng</h2>
        <Button asChild variant="outline">
          <Link to="/categories">Quay lại danh mục</Link>
        </Button>
      </div>
    );
  }

  // Parse the translation string to get the main translation
  const mainTranslation = word.translation && word.translation.includes('Translation:') ? 
    word.translation.split('Translation:')[1].split('(')[0].trim() : 
    word.meaning || word.translation;
  
  // Get additional meanings if any
  const additionalMeanings = word.translation && word.translation.includes('Additional meanings/notes:') ?
    word.translation.split('Additional meanings/notes:')[1].replace(/[()]/g, '').trim() :
    null;
  
  return (
    <div className="space-y-8">
      <div className="flex items-center mb-2">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link to={`/categories/${word.category}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {word.category}
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-4xl font-jp">{word.japanese}</CardTitle>
                {word.jlpt && <Badge variant="outline">{word.jlpt}</Badge>}
              </div>
              <CardDescription className="text-lg">
                {word.reading || word.japanese}
              </CardDescription>
            </div>
            
            {word.audio_file && (
              <div className="mt-4 md:mt-0 flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePlayAudio}
                  className={`mr-2 ${isPlaying ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  <Volume className="h-4 w-4" />
                </Button>
                <audio 
                  controls
                  className="max-w-full hidden" 
                  src={`http://localhost:5000/audio/${word.audio_file}`}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Nghĩa</h3>
            <p className="text-xl">{mainTranslation}</p>
            {additionalMeanings && (
              <p className="text-muted-foreground mt-2">{additionalMeanings}</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Mẹo nhớ</h3>
            <div className="bg-secondary/50 p-4 rounded-md whitespace-pre-wrap">
              {word.mnemonic}
            </div>
          </div>
          
          {word.image_prompt && (
            <div>
              <h3 className="text-lg font-medium mb-2">Mô tả hình ảnh</h3>
              <div className="bg-secondary/30 p-4 rounded-md text-sm text-muted-foreground">
                <p className="whitespace-pre-wrap">{word.image_prompt}</p>
              </div>
            </div>
          )}
          
          {word.image_url && (
            <div>
              <h3 className="text-lg font-medium mb-2">Hình ảnh minh họa</h3>
              <div className="aspect-square max-w-lg mx-auto">
                <img 
                  src={word.image_url.startsWith('http') ? word.image_url : `http://localhost:5000/${word.image_url}`} 
                  alt={word.japanese} 
                  className="rounded-md object-contain w-full h-full" 
                />
              </div>
            </div>
          )}
          
          {word.tags && word.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Thẻ</h3>
              <div className="flex flex-wrap gap-2">
                {word.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Được tạo vào: {new Date(word.created_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordDetail;
