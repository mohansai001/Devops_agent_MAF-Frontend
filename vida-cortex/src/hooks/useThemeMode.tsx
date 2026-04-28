import { createContext, useContext, useState } from 'react';

interface ThemeCtx { isDark: boolean; toggle: () => void }

const ThemeContext = createContext<ThemeCtx>({ isDark: true, toggle: () => {} });

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  return (
    <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark((p) => !p) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeContext);
