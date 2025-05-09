
export interface Category {
  id: string;
  name: string;
  nameJp?: string;
  description?: string;
  imageUrl?: string;
  wordCount?: number;
}

export interface Example {
  japanese: string;
  reading: string;
  translation: string;
}

export interface Word {
  id: string;
  japanese: string;
  reading?: string;
  meaning?: string;
  translation: string;
  mnemonic: string;
  examples?: Example[];
  categoryId?: string;
  category: string;
  jlpt?: string;
  tags?: string[];
  image_url: string;
  audio_file: string;
  image_prompt?: string;
  created_at: string;
  last_reviewed: string | null;
  review_count: number;
}

// Helper function to paginate data
export function paginate<T>(items: T[], page: number, pageSize: number): {
  items: T[],
  totalPages: number
} {
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(items.length / pageSize);
  
  return {
    items: paginatedItems,
    totalPages
  };
}
