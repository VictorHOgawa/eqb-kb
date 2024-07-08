import React, { createContext, useContext, useState, ReactNode } from "react";

interface CityContextType {
  selectedCity: { name: string; state: string; id: string };
  setSelectedCity: (city: { name: string; state: string; id: string }) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

interface CityProviderProps {
  children: ReactNode;
}

export function CityProvider({ children }: CityProviderProps): JSX.Element {
  const [selectedCity, setSelectedCity] = useState({
    name: "Todas as Cidades",
    state: "",
    id: "",
  });
  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity(): CityContextType {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
