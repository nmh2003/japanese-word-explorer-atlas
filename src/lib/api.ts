
const API_URL = 'http://localhost:5000';

// Category API functions
export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_URL}/get_words`);
  const data = await response.json();
  return data.categories || [];
}

export async function addCategory(category: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/add_category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ category }),
  });
  const data = await response.json();
  return data.success;
}

// Word API functions
export async function getWords(): Promise<Word[]> {
  const response = await fetch(`${API_URL}/get_words`);
  const data = await response.json();
  return data.words || [];
}

export async function getWordsByCategory(categoryId: string): Promise<Word[]> {
  const response = await fetch(`${API_URL}/get_words`);
  const data = await response.json();
  return (data.words || []).filter((word: Word) => word.category === categoryId);
}

export async function addWords(words: string, category: string): Promise<Word[]> {
  const response = await fetch(`${API_URL}/add_words`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ words, category }),
  });
  const data = await response.json();
  return data.results || [];
}

export async function updateWord(wordId: string, wordData: Partial<Word>): Promise<boolean> {
  const response = await fetch(`${API_URL}/update_word/${wordId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wordData),
  });
  const data = await response.json();
  return data.success;
}

export async function deleteWord(wordId: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/delete_word/${wordId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  return data.success;
}

// Add function types for the Word interface based on Flask API response
import { Word } from '@/data/dictionary';
