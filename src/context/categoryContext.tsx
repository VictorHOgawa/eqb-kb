import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Category {
  background: string;
  icon: string;
  name: string;
  type: string;
  id: string;
}

interface CategoryContextType {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  categoriesIndex: number;
  setCategoriesIndex: (index: number) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export function CategoryProvider({ children }: CategoryProviderProps): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesIndex, setCategoriesIndex] = useState<number>(5);

  return (
    <CategoryContext.Provider
      value={{ categories, setCategories, categoriesIndex, setCategoriesIndex }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory(): CategoryContextType {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}
