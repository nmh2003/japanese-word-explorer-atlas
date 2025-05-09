
export interface Category {
  id: string;
  name: string;
  nameJp: string;
  description: string;
  imageUrl: string;
  wordCount: number;
}

export interface Word {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  examples: Example[];
  categoryId: string;
  jlpt: string;
  tags: string[];
}

export interface Example {
  japanese: string;
  reading: string;
  translation: string;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Chào hỏi",
    nameJp: "挨拶",
    description: "Các từ vựng và cụm từ thông dụng khi chào hỏi trong tiếng Nhật",
    imageUrl: "/placeholder.svg",
    wordCount: 15
  },
  {
    id: "2",
    name: "Du lịch",
    nameJp: "旅行",
    description: "Từ vựng cần thiết khi đi du lịch tại Nhật Bản",
    imageUrl: "/placeholder.svg",
    wordCount: 24
  },
  {
    id: "3",
    name: "Ẩm thực",
    nameJp: "料理",
    description: "Các từ vựng liên quan đến ẩm thực, món ăn và nhà hàng",
    imageUrl: "/placeholder.svg",
    wordCount: 18
  },
  {
    id: "4",
    name: "Mua sắm",
    nameJp: "買い物",
    description: "Từ vựng hữu ích khi mua sắm tại Nhật Bản",
    imageUrl: "/placeholder.svg",
    wordCount: 16
  },
  {
    id: "5",
    name: "Công việc",
    nameJp: "仕事",
    description: "Từ vựng liên quan đến công việc và môi trường làm việc",
    imageUrl: "/placeholder.svg",
    wordCount: 22
  },
  {
    id: "6",
    name: "Học tập",
    nameJp: "学習",
    description: "Từ vựng về học tập và giáo dục trong tiếng Nhật",
    imageUrl: "/placeholder.svg",
    wordCount: 20
  },
  {
    id: "7",
    name: "Giao thông",
    nameJp: "交通",
    description: "Từ vựng liên quan đến giao thông và di chuyển",
    imageUrl: "/placeholder.svg",
    wordCount: 14
  },
  {
    id: "8",
    name: "Gia đình",
    nameJp: "家族",
    description: "Từ vựng về gia đình và các mối quan hệ",
    imageUrl: "/placeholder.svg",
    wordCount: 17
  },
  {
    id: "9",
    name: "Thể thao",
    nameJp: "スポーツ",
    description: "Từ vựng liên quan đến hoạt động thể thao và thể dục",
    imageUrl: "/placeholder.svg",
    wordCount: 19
  },
  {
    id: "10",
    name: "Sức khỏe",
    nameJp: "健康",
    description: "Từ vựng về sức khỏe, bệnh tật và y tế",
    imageUrl: "/placeholder.svg",
    wordCount: 21
  },
  {
    id: "11",
    name: "Thời gian",
    nameJp: "時間",
    description: "Từ vựng liên quan đến thời gian, ngày tháng",
    imageUrl: "/placeholder.svg",
    wordCount: 13
  },
  {
    id: "12",
    name: "Thời tiết",
    nameJp: "天気",
    description: "Từ vựng về thời tiết và các hiện tượng tự nhiên",
    imageUrl: "/placeholder.svg",
    wordCount: 15
  }
];

export const words: Word[] = [
  {
    id: "101",
    word: "おはよう",
    reading: "おはよう",
    meaning: "Chào buổi sáng",
    examples: [
      {
        japanese: "おはようございます。",
        reading: "おはようございます。",
        translation: "Chào buổi sáng (lịch sự)."
      },
      {
        japanese: "おはよう、元気？",
        reading: "おはよう、げんき？",
        translation: "Chào buổi sáng, khỏe không?"
      }
    ],
    categoryId: "1",
    jlpt: "N5",
    tags: ["chào hỏi", "buổi sáng"]
  },
  {
    id: "102",
    word: "こんにちは",
    reading: "こんにちは",
    meaning: "Xin chào (ban ngày)",
    examples: [
      {
        japanese: "こんにちは、お元気ですか？",
        reading: "こんにちは、おげんきですか？",
        translation: "Xin chào, bạn có khỏe không?"
      }
    ],
    categoryId: "1",
    jlpt: "N5",
    tags: ["chào hỏi", "ban ngày"]
  },
  {
    id: "103",
    word: "こんばんは",
    reading: "こんばんは",
    meaning: "Chào buổi tối",
    examples: [
      {
        japanese: "こんばんは、いい夜ですね。",
        reading: "こんばんは、いいよるですね。",
        translation: "Chào buổi tối, đêm đẹp nhỉ."
      }
    ],
    categoryId: "1",
    jlpt: "N5",
    tags: ["chào hỏi", "buổi tối"]
  },
  {
    id: "104",
    word: "さようなら",
    reading: "さようなら",
    meaning: "Tạm biệt",
    examples: [
      {
        japanese: "さようなら、また明日。",
        reading: "さようなら、またあした。",
        translation: "Tạm biệt, hẹn gặp lại ngày mai."
      }
    ],
    categoryId: "1",
    jlpt: "N5",
    tags: ["tạm biệt"]
  },
  {
    id: "105",
    word: "ありがとう",
    reading: "ありがとう",
    meaning: "Cảm ơn",
    examples: [
      {
        japanese: "ありがとうございます。",
        reading: "ありがとうございます。",
        translation: "Cảm ơn (lịch sự)."
      },
      {
        japanese: "どうもありがとう。",
        reading: "どうもありがとう。",
        translation: "Cảm ơn nhiều."
      }
    ],
    categoryId: "1",
    jlpt: "N5",
    tags: ["cảm ơn"]
  },
  // Words for "Du lịch" category
  {
    id: "201",
    word: "旅館",
    reading: "りょかん",
    meaning: "Khách sạn kiểu Nhật",
    examples: [
      {
        japanese: "この旅館は温泉があります。",
        reading: "このりょかんはおんせんがあります。",
        translation: "Khách sạn kiểu Nhật này có suối nước nóng."
      }
    ],
    categoryId: "2",
    jlpt: "N4",
    tags: ["du lịch", "chỗ ở"]
  },
  {
    id: "202",
    word: "観光",
    reading: "かんこう",
    meaning: "Du lịch, tham quan",
    examples: [
      {
        japanese: "京都で観光しました。",
        reading: "きょうとでかんこうしました。",
        translation: "Tôi đã đi tham quan ở Kyoto."
      }
    ],
    categoryId: "2",
    jlpt: "N4",
    tags: ["du lịch", "tham quan"]
  },
  {
    id: "203",
    word: "地図",
    reading: "ちず",
    meaning: "Bản đồ",
    examples: [
      {
        japanese: "地図を見て道を探します。",
        reading: "ちずをみてみちをさがします。",
        translation: "Tôi tìm đường bằng cách xem bản đồ."
      }
    ],
    categoryId: "2",
    jlpt: "N5",
    tags: ["du lịch", "bản đồ"]
  },
  // More words can be added here...
];

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

// Helper function to get a word by ID
export function getWordById(id: string): Word | undefined {
  return words.find(word => word.id === id);
}

// Helper function to get all words for a category
export function getWordsByCategory(categoryId: string): Word[] {
  return words.filter(word => word.categoryId === categoryId);
}

// Helper function to get a category by ID
export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}
