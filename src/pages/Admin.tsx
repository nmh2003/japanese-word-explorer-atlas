
import { useState } from 'react';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import CategoryManager from '@/components/CategoryManager';
import WordManager from '@/components/WordManager';
import WordList from '@/components/WordList';
import WordEditor from '@/components/WordEditor';
import { Word } from '@/data/dictionary';

const Admin = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  const handleWordAdded = () => {
    // Increment the refresh trigger to reload the word list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditWord = (word: Word) => {
    setEditingWord(word);
  };

  const handleSaveEdit = () => {
    setEditingWord(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingWord(null);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Quản trị dữ liệu</h1>
      
      <Tabs defaultValue="categories">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="categories">Danh mục</TabsTrigger>
          <TabsTrigger value="words">Từ vựng</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-6">
          <CategoryManager />
        </TabsContent>
        
        <TabsContent value="words" className="space-y-6">
          {editingWord ? (
            <WordEditor 
              word={editingWord}
              onSaved={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <WordManager onWordAdded={handleWordAdded} />
          )}
          
          <WordList 
            refreshTrigger={refreshTrigger}
            onEdit={handleEditWord}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
