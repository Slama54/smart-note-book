// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
}

export interface Page {
  id: string;
  pageNumber: number;
  title: string;
  content?: string;
  imageUrl: string;
  chapterId: string;
  notebookId: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
  qrCodeValue: string;
}

export interface Chapter {
  id: string;
  name: string;
  notebookId: string;
  pageIds: string[];
  createdAt: string;
  description?: string;
  color?: string;
}

export interface Notebook {
  id: string;
  name: string;
  coverColor: string;
  coverPattern?: 'dots' | 'lines' | 'grid' | 'plain';
  pageCount: number;
  chapterIds: string[];
  createdAt: string;
  lastEdited: string;
  isArchived: boolean;
}

// Mock Data
export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  joinDate: '2026-01-15'
};

export const mockNotebooks: Notebook[] = [
  {
    id: 'nb-1',
    name: 'University Notes',
    coverColor: '#2E7D32',
    coverPattern: 'grid',
    pageCount: 45,
    chapterIds: ['ch-1', 'ch-2', 'ch-3', 'ch-4', 'ch-5', 'ch-6'],
    createdAt: '2026-01-20',
    lastEdited: '2026-02-15',
    isArchived: false
  },
  {
    id: 'nb-2',
    name: 'Work Journal',
    coverColor: '#4A90E2',
    coverPattern: 'lines',
    pageCount: 23,
    chapterIds: ['ch-7', 'ch-8', 'ch-9'],
    createdAt: '2026-02-01',
    lastEdited: '2026-02-14',
    isArchived: false
  },
  {
    id: 'nb-3',
    name: 'Personal Diary',
    coverColor: '#9C27B0',
    coverPattern: 'plain',
    pageCount: 12,
    chapterIds: ['ch-10'],
    createdAt: '2026-02-10',
    lastEdited: '2026-02-13',
    isArchived: false
  }
];

export const mockChapters: Chapter[] = [
  {
    id: 'ch-1',
    name: 'Mathematics',
    notebookId: 'nb-1',
    pageIds: ['p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-7', 'p-8'],
    createdAt: '2026-01-20',
    description: 'Calculus and Linear Algebra',
    color: '#FF6B6B'
  },
  {
    id: 'ch-2',
    name: 'Physics',
    notebookId: 'nb-1',
    pageIds: ['p-9', 'p-10', 'p-11', 'p-12', 'p-13', 'p-14', 'p-15'],
    createdAt: '2026-01-21',
    description: 'Quantum Mechanics and Thermodynamics',
    color: '#4ECDC4'
  },
  {
    id: 'ch-3',
    name: 'Literature',
    notebookId: 'nb-1',
    pageIds: ['p-16', 'p-17', 'p-18', 'p-19', 'p-20'],
    createdAt: '2026-01-22',
    description: 'Shakespeare and Modern Poetry',
    color: '#FFD93D'
  },
  {
    id: 'ch-4',
    name: 'History',
    notebookId: 'nb-1',
    pageIds: ['p-21', 'p-22', 'p-23', 'p-24', 'p-25', 'p-26'],
    createdAt: '2026-01-23',
    description: 'World War II and Cold War',
    color: '#6BCB77'
  },
  {
    id: 'ch-5',
    name: 'Chemistry',
    notebookId: 'nb-1',
    pageIds: ['p-27', 'p-28', 'p-29', 'p-30', 'p-31'],
    createdAt: '2026-01-24',
    description: 'Organic Chemistry',
    color: '#FF9F43'
  },
  {
    id: 'ch-6',
    name: 'Languages',
    notebookId: 'nb-1',
    pageIds: ['p-32', 'p-33', 'p-34', 'p-35', 'p-36', 'p-37', 'p-38', 'p-39', 'p-40', 'p-41', 'p-42', 'p-43', 'p-44', 'p-45'],
    createdAt: '2026-01-25',
    description: 'Spanish and French',
    color: '#A8E6CF'
  },
  {
    id: 'ch-7',
    name: 'Meetings',
    notebookId: 'nb-2',
    pageIds: ['p-46', 'p-47', 'p-48', 'p-49', 'p-50', 'p-51', 'p-52', 'p-53'],
    createdAt: '2026-02-01',
    description: 'Team sync and client meetings',
    color: '#FF8A5C'
  },
  {
    id: 'ch-8',
    name: 'Project Ideas',
    notebookId: 'nb-2',
    pageIds: ['p-54', 'p-55', 'p-56', 'p-57', 'p-58', 'p-59', 'p-60'],
    createdAt: '2026-02-03',
    description: 'Brainstorming and concepts',
    color: '#B5EAD7'
  },
  {
    id: 'ch-9',
    name: 'Daily Logs',
    notebookId: 'nb-2',
    pageIds: ['p-61', 'p-62', 'p-63', 'p-64', 'p-65', 'p-66', 'p-67', 'p-68'],
    createdAt: '2026-02-05',
    description: 'Daily standup notes',
    color: '#C7CEEA'
  },
  {
    id: 'ch-10',
    name: 'Journal Entries',
    notebookId: 'nb-3',
    pageIds: ['p-69', 'p-70', 'p-71', 'p-72', 'p-73', 'p-74', 'p-75', 'p-76', 'p-77', 'p-78', 'p-79', 'p-80'],
    createdAt: '2026-02-10',
    description: 'Personal thoughts and memories',
    color: '#F7C6C6'
  }
];

const pageImages = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=500&fit=crop',
];

export const mockPages: Page[] = Array.from({ length: 80 }, (_, i) => {
  const pageNum = i + 1;
  const chapterMap: Record<number, string> = {
    // ch-1: p-1 to p-8
    1: 'ch-1', 2: 'ch-1', 3: 'ch-1', 4: 'ch-1', 5: 'ch-1', 6: 'ch-1', 7: 'ch-1', 8: 'ch-1',
    // ch-2: p-9 to p-15
    9: 'ch-2', 10: 'ch-2', 11: 'ch-2', 12: 'ch-2', 13: 'ch-2', 14: 'ch-2', 15: 'ch-2',
    // ch-3: p-16 to p-20
    16: 'ch-3', 17: 'ch-3', 18: 'ch-3', 19: 'ch-3', 20: 'ch-3',
    // ch-4: p-21 to p-26
    21: 'ch-4', 22: 'ch-4', 23: 'ch-4', 24: 'ch-4', 25: 'ch-4', 26: 'ch-4',
    // ch-5: p-27 to p-31
    27: 'ch-5', 28: 'ch-5', 29: 'ch-5', 30: 'ch-5', 31: 'ch-5',
    // ch-6: p-32 to p-45
    32: 'ch-6', 33: 'ch-6', 34: 'ch-6', 35: 'ch-6', 36: 'ch-6', 37: 'ch-6', 38: 'ch-6', 39: 'ch-6', 40: 'ch-6', 41: 'ch-6', 42: 'ch-6', 43: 'ch-6', 44: 'ch-6', 45: 'ch-6',
    // ch-7: p-46 to p-53
    46: 'ch-7', 47: 'ch-7', 48: 'ch-7', 49: 'ch-7', 50: 'ch-7', 51: 'ch-7', 52: 'ch-7', 53: 'ch-7',
    // ch-8: p-54 to p-60
    54: 'ch-8', 55: 'ch-8', 56: 'ch-8', 57: 'ch-8', 58: 'ch-8', 59: 'ch-8', 60: 'ch-8',
    // ch-9: p-61 to p-68
    61: 'ch-9', 62: 'ch-9', 63: 'ch-9', 64: 'ch-9', 65: 'ch-9', 66: 'ch-9', 67: 'ch-9', 68: 'ch-9',
    // ch-10: p-69 to p-80
    69: 'ch-10', 70: 'ch-10', 71: 'ch-10', 72: 'ch-10', 73: 'ch-10', 74: 'ch-10', 75: 'ch-10', 76: 'ch-10', 77: 'ch-10', 78: 'ch-10', 79: 'ch-10', 80: 'ch-10',
  };

  const notebookMap: Record<string, string> = {
    'ch-1': 'nb-1', 'ch-2': 'nb-1', 'ch-3': 'nb-1', 'ch-4': 'nb-1', 'ch-5': 'nb-1', 'ch-6': 'nb-1',
    'ch-7': 'nb-2', 'ch-8': 'nb-2', 'ch-9': 'nb-2',
    'ch-10': 'nb-3',
  };

  const chapterId = chapterMap[pageNum] || 'ch-1';
  const notebookId = notebookMap[chapterId] || 'nb-1';

  return {
    id: `p-${pageNum}`,
    pageNumber: pageNum,
    title: `Page ${pageNum} - Notes`,
    content: `Content for page ${pageNum}...`,
    imageUrl: pageImages[pageNum % pageImages.length],
    chapterId,
    notebookId,
    createdAt: new Date(2026, 0, 20 + Math.floor(pageNum / 5)).toISOString().split('T')[0],
    updatedAt: new Date(2026, 1, Math.floor(Math.random() * 15) + 1).toISOString().split('T')[0],
    isFavorite: pageNum % 7 === 0,
    tags: ['notes', 'study'].slice(0, Math.floor(Math.random() * 2) + 1),
    qrCodeValue: `NB-CH-P${pageNum}-${Math.random().toString(36).substr(2, 9)}`
  };
});
