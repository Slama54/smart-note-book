'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Notebook, Chapter, Page, User } from './mockData';
import { mockUser, mockNotebooks, mockChapters, mockPages } from './mockData';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  scanQuality: 'low' | 'medium' | 'high';
  ocrLanguage: string;
  autoSave: boolean;
  notifications: boolean;
  viewMode: 'grid' | 'list';
}

export interface AppState {
  user: User;
  notebooks: Notebook[];
  chapters: Chapter[];
  pages: Page[];
  favorites: string[];
  settings: AppSettings;
}

export interface AppContextType extends AppState {
  addNotebook: (notebook: Omit<Notebook, 'id' | 'createdAt'>) => void;
  updateNotebook: (id: string, updates: Partial<Notebook>) => void;
  deleteNotebook: (id: string) => void;
  
  addChapter: (chapter: Omit<Chapter, 'id' | 'createdAt'>) => void;
  updateChapter: (id: string, updates: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;
  reorderChapters: (notebookId: string, chapterIds: string[]) => void;
  
  addPage: (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  movePage: (pageId: string, targetChapterId: string) => void;
  
  toggleFavorite: (pageId: string) => void;
  searchPages: (query: string) => Page[];
  searchNotebooks: (query: string) => Notebook[];
  
  updateSettings: (updates: Partial<AppSettings>) => void;
  getNotebookById: (id: string) => Notebook | undefined;
  getChapterById: (id: string) => Chapter | undefined;
  getPageById: (id: string) => Page | undefined;
  getPagesByChapter: (chapterId: string) => Page[];
  getChaptersByNotebook: (notebookId: string) => Chapter[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_NOTEBOOK'; payload: Notebook }
  | { type: 'UPDATE_NOTEBOOK'; payload: { id: string; updates: Partial<Notebook> } }
  | { type: 'DELETE_NOTEBOOK'; payload: string }
  | { type: 'ADD_CHAPTER'; payload: Chapter }
  | { type: 'UPDATE_CHAPTER'; payload: { id: string; updates: Partial<Chapter> } }
  | { type: 'DELETE_CHAPTER'; payload: string }
  | { type: 'REORDER_CHAPTERS'; payload: { notebookId: string; chapterIds: string[] } }
  | { type: 'ADD_PAGE'; payload: Page }
  | { type: 'UPDATE_PAGE'; payload: { id: string; updates: Partial<Page> } }
  | { type: 'DELETE_PAGE'; payload: string }
  | { type: 'MOVE_PAGE'; payload: { pageId: string; targetChapterId: string } }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> };

const defaultSettings: AppSettings = {
  theme: 'system',
  scanQuality: 'high',
  ocrLanguage: 'English',
  autoSave: true,
  notifications: true,
  viewMode: 'grid',
};

const getInitialState = (): AppState => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('appState');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }
  
  return {
    user: mockUser,
    notebooks: mockNotebooks,
    chapters: mockChapters,
    pages: mockPages,
    favorites: mockPages.filter(p => p.isFavorite).map(p => p.id),
    settings: defaultSettings,
  };
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_NOTEBOOK': {
      const updated = {
        ...state,
        notebooks: [...state.notebooks, action.payload]
      };
      return updated;
    }

    case 'UPDATE_NOTEBOOK': {
      return {
        ...state,
        notebooks: state.notebooks.map(nb =>
          nb.id === action.payload.id ? { ...nb, ...action.payload.updates } : nb
        )
      };
    }

    case 'DELETE_NOTEBOOK': {
      const notebookId = action.payload;
      return {
        ...state,
        notebooks: state.notebooks.filter(nb => nb.id !== notebookId),
        chapters: state.chapters.filter(ch => ch.notebookId !== notebookId),
        pages: state.pages.filter(p => p.notebookId !== notebookId),
        favorites: state.favorites.filter(fav =>
          !state.pages.find(p => p.id === fav && p.notebookId === notebookId)
        )
      };
    }

    case 'ADD_CHAPTER': {
      return {
        ...state,
        chapters: [...state.chapters, action.payload],
        notebooks: state.notebooks.map(nb =>
          nb.id === action.payload.notebookId
            ? { ...nb, chapterIds: [...nb.chapterIds, action.payload.id] }
            : nb
        )
      };
    }

    case 'UPDATE_CHAPTER': {
      return {
        ...state,
        chapters: state.chapters.map(ch =>
          ch.id === action.payload.id ? { ...ch, ...action.payload.updates } : ch
        )
      };
    }

    case 'DELETE_CHAPTER': {
      const chapterId = action.payload;
      const chapter = state.chapters.find(ch => ch.id === chapterId);
      
      if (!chapter) return state;

      const pagesInChapter = state.pages.filter(p => p.chapterId === chapterId);
      const removedPageIds = pagesInChapter.map(p => p.id);

      return {
        ...state,
        chapters: state.chapters.filter(ch => ch.id !== chapterId),
        pages: state.pages.filter(p => p.chapterId !== chapterId),
        notebooks: state.notebooks.map(nb =>
          nb.id === chapter.notebookId
            ? { ...nb, chapterIds: nb.chapterIds.filter(id => id !== chapterId) }
            : nb
        ),
        favorites: state.favorites.filter(fav => !removedPageIds.includes(fav))
      };
    }

    case 'REORDER_CHAPTERS': {
      return {
        ...state,
        notebooks: state.notebooks.map(nb =>
          nb.id === action.payload.notebookId
            ? { ...nb, chapterIds: action.payload.chapterIds }
            : nb
        )
      };
    }

    case 'ADD_PAGE': {
      const updatedPage = action.payload;
      return {
        ...state,
        pages: [...state.pages, updatedPage],
        chapters: state.chapters.map(ch =>
          ch.id === updatedPage.chapterId
            ? { ...ch, pageIds: [...ch.pageIds, updatedPage.id] }
            : ch
        ),
        notebooks: state.notebooks.map(nb =>
          nb.id === updatedPage.notebookId
            ? { ...nb, pageCount: nb.pageCount + 1 }
            : nb
        )
      };
    }

    case 'UPDATE_PAGE': {
      return {
        ...state,
        pages: state.pages.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        )
      };
    }

    case 'DELETE_PAGE': {
      const pageId = action.payload;
      const page = state.pages.find(p => p.id === pageId);

      if (!page) return state;

      return {
        ...state,
        pages: state.pages.filter(p => p.id !== pageId),
        chapters: state.chapters.map(ch =>
          ch.id === page.chapterId
            ? { ...ch, pageIds: ch.pageIds.filter(id => id !== pageId) }
            : ch
        ),
        notebooks: state.notebooks.map(nb =>
          nb.id === page.notebookId
            ? { ...nb, pageCount: Math.max(0, nb.pageCount - 1) }
            : nb
        ),
        favorites: state.favorites.filter(fav => fav !== pageId)
      };
    }

    case 'MOVE_PAGE': {
      const { pageId, targetChapterId } = action.payload;
      const page = state.pages.find(p => p.id === pageId);

      if (!page || page.chapterId === targetChapterId) return state;

      return {
        ...state,
        pages: state.pages.map(p =>
          p.id === pageId ? { ...p, chapterId: targetChapterId } : p
        ),
        chapters: state.chapters.map(ch => ({
          ...ch,
          pageIds: ch.id === page.chapterId
            ? ch.pageIds.filter(id => id !== pageId)
            : ch.id === targetChapterId
            ? [...ch.pageIds, pageId]
            : ch.pageIds
        }))
      };
    }

    case 'TOGGLE_FAVORITE': {
      const pageId = action.payload;
      const isFav = state.favorites.includes(pageId);

      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter(id => id !== pageId)
          : [...state.favorites, pageId],
        pages: state.pages.map(p =>
          p.id === pageId ? { ...p, isFavorite: !isFav } : p
        )
      };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appState', JSON.stringify(state));
    }
  }, [state]);

  const addNotebook = (notebook: Omit<Notebook, 'id' | 'createdAt'>) => {
    const newNotebook: Notebook = {
      ...notebook,
      id: `nb-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    dispatch({ type: 'ADD_NOTEBOOK', payload: newNotebook });
  };

  const updateNotebook = (id: string, updates: Partial<Notebook>) => {
    dispatch({ type: 'UPDATE_NOTEBOOK', payload: { id, updates } });
  };

  const deleteNotebook = (id: string) => {
    dispatch({ type: 'DELETE_NOTEBOOK', payload: id });
  };

  const addChapter = (chapter: Omit<Chapter, 'id' | 'createdAt'>) => {
    const newChapter: Chapter = {
      ...chapter,
      id: `ch-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    dispatch({ type: 'ADD_CHAPTER', payload: newChapter });
  };

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    dispatch({ type: 'UPDATE_CHAPTER', payload: { id, updates } });
  };

  const deleteChapter = (id: string) => {
    dispatch({ type: 'DELETE_CHAPTER', payload: id });
  };

  const reorderChapters = (notebookId: string, chapterIds: string[]) => {
    dispatch({ type: 'REORDER_CHAPTERS', payload: { notebookId, chapterIds } });
  };

  const addPage = (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPage: Page = {
      ...page,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    dispatch({ type: 'ADD_PAGE', payload: newPage });
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
    dispatch({ type: 'UPDATE_PAGE', payload: { id, updates } });
  };

  const deletePage = (id: string) => {
    dispatch({ type: 'DELETE_PAGE', payload: id });
  };

  const movePage = (pageId: string, targetChapterId: string) => {
    dispatch({ type: 'MOVE_PAGE', payload: { pageId, targetChapterId } });
  };

  const toggleFavorite = (pageId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: pageId });
  };

  const searchPages = (query: string): Page[] => {
    const q = query.toLowerCase();
    return state.pages.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.content?.toLowerCase().includes(q)
    );
  };

  const searchNotebooks = (query: string): Notebook[] => {
    const q = query.toLowerCase();
    return state.notebooks.filter(nb => nb.name.toLowerCase().includes(q));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates });
  };

  const getNotebookById = (id: string) => state.notebooks.find(nb => nb.id === id);
  const getChapterById = (id: string) => state.chapters.find(ch => ch.id === id);
  const getPageById = (id: string) => state.pages.find(p => p.id === id);
  const getPagesByChapter = (chapterId: string) => state.pages.filter(p => p.chapterId === chapterId);
  const getChaptersByNotebook = (notebookId: string) => state.chapters.filter(ch => ch.notebookId === notebookId);

  const value: AppContextType = {
    ...state,
    addNotebook,
    updateNotebook,
    deleteNotebook,
    addChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
    addPage,
    updatePage,
    deletePage,
    movePage,
    toggleFavorite,
    searchPages,
    searchNotebooks,
    updateSettings,
    getNotebookById,
    getChapterById,
    getPageById,
    getPagesByChapter,
    getChaptersByNotebook,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
