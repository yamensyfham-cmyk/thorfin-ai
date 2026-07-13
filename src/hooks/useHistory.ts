import { useState, useCallback, useEffect } from 'react';
import type { GeneratedImage } from '@/types';

const STORAGE_KEY = 'thorfin-history';
const MAX_ITEMS = 100;

function loadHistory(): GeneratedImage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: GeneratedImage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch (e) {
    console.warn('Failed to save history:', e);
  }
}

export function useHistory() {
  const [images, setImages] = useState<GeneratedImage[]>(loadHistory);

  useEffect(() => {
    saveHistory(images);
  }, [images]);

  const addImage = useCallback((image: GeneratedImage) => {
    setImages(prev => [image, ...prev].slice(0, MAX_ITEMS));
  }, []);

  const deleteImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, favorite: !img.favorite } : img
    ));
  }, []);

  const clearHistory = useCallback(() => {
    setImages([]);
  }, []);

  const exportHistory = useCallback(() => {
    const data = JSON.stringify(images, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thorfin-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [images]);

  const importHistory = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          setImages(prev => [...imported, ...prev].slice(0, MAX_ITEMS));
        }
      } catch {
        console.error('Failed to import history');
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    images,
    addImage,
    deleteImage,
    toggleFavorite,
    clearHistory,
    exportHistory,
    importHistory
  };
}
