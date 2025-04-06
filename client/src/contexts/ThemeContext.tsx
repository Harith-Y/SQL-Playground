import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { auth } from '../services/firebase';

interface CustomTheme {
  name: string;
  colors: {
    editor: string;
    schema: string;
    results: string;
    background: string;
    text: string;
  };
}

interface ThemeContextType {
  currentTheme: CustomTheme;
  themes: CustomTheme[];
  addTheme: (theme: CustomTheme) => Promise<void>;
  updateTheme: (theme: CustomTheme) => Promise<void>;
  deleteTheme: (themeName: string) => Promise<void>;
  setCurrentTheme: (theme: CustomTheme) => void;
}

const defaultTheme: CustomTheme = {
  name: 'Default Dark',
  colors: {
    editor: '#1e1e1e',
    schema: '#2d2d2d',
    results: '#2d2d2d',
    background: '#1a1a1a',
    text: '#ffffff',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: defaultTheme,
  themes: [defaultTheme],
  addTheme: async () => {},
  updateTheme: async () => {},
  deleteTheme: async () => {},
  setCurrentTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const getStoredThemes = (userId: string) => {
  try {
    const stored = localStorage.getItem(`themes_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading themes from storage:', error);
  }
  return null;
};

const storeThemes = (userId: string, themes: CustomTheme[], currentTheme: CustomTheme) => {
  try {
    localStorage.setItem(`themes_${userId}`, JSON.stringify({ themes, currentTheme }));
  } catch (error) {
    console.error('Error storing themes:', error);
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(defaultTheme);
  const [themes, setThemes] = useState<CustomTheme[]>([defaultTheme]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const stored = getStoredThemes(user.uid);
        if (stored) {
          setThemes(stored.themes);
          setCurrentTheme(stored.currentTheme);
        } else {
          storeThemes(user.uid, [defaultTheme], defaultTheme);
        }
      } else {
        setThemes([defaultTheme]);
        setCurrentTheme(defaultTheme);
      }
    });

    return () => unsubscribe();
  }, []);

  const addTheme = async (theme: CustomTheme) => {
    const user = auth.currentUser;
    if (!user) return;

    const newThemes = [...themes, theme];
    setThemes(newThemes);
    storeThemes(user.uid, newThemes, currentTheme);
  };

  const updateTheme = async (theme: CustomTheme) => {
    const user = auth.currentUser;
    if (!user) return;

    const newThemes = themes.map(t => t.name === theme.name ? theme : t);
    setThemes(newThemes);
    storeThemes(user.uid, newThemes, currentTheme);
  };

  const deleteTheme = async (themeName: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const newThemes = themes.filter(t => t.name !== themeName);
    setThemes(newThemes);

    if (currentTheme.name === themeName) {
      setCurrentTheme(defaultTheme);
      storeThemes(user.uid, newThemes, defaultTheme);
    } else {
      storeThemes(user.uid, newThemes, currentTheme);
    }
  };

  const handleSetCurrentTheme = async (theme: CustomTheme) => {
    const user = auth.currentUser;
    if (!user) return;

    setCurrentTheme(theme);
    storeThemes(user.uid, themes, theme);
  };

  const muiTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: currentTheme.colors.text,
      },
      background: {
        default: currentTheme.colors.background,
        paper: currentTheme.colors.background,
      },
      text: {
        primary: currentTheme.colors.text,
      },
    },
  });

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themes,
        addTheme,
        updateTheme,
        deleteTheme,
        setCurrentTheme: handleSetCurrentTheme,
      }}
    >
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 