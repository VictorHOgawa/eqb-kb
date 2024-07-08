import React, { createContext, useContext, useState, ReactNode } from "react";



interface CategoryTypeContextType {
  categoryType: string;
  setCategoryType: (type: string) => void;
}

const CategoryTypeContext = createContext<CategoryTypeContextType | undefined>(undefined);

interface CategoryTypeProviderProps {
  children: ReactNode;
}

export function CategoryTypeProvider({ children }: CategoryTypeProviderProps): JSX.Element {
  const [categoryType, setCategoryType] = useState<string>("event");

  return (
    <CategoryTypeContext.Provider value={{ categoryType, setCategoryType }}>
      {children}
    </CategoryTypeContext.Provider>
  );
}

export function useCategoryType(): CategoryTypeContextType {
  const context = useContext(CategoryTypeContext);
  if (context === undefined) {
    throw new Error("useCategoryType must be used within a CategoryTypeProvider");
  }
  return context;
}
