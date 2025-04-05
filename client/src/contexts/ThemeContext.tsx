import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themes, setThemes] = useState<CustomTheme[]>([defaultTheme]);
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(defaultTheme);

  useEffect(() => {
    const loadThemes = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userThemesRef = doc(db, 'userThemes', user.uid);
      const docSnap = await getDoc(userThemesRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setThemes(data.themes);
        setCurrentTheme(data.currentTheme);
      } else {
        // Initialize with default theme
        await setDoc(userThemesRef, {
          themes: [defaultTheme],
          currentTheme: defaultTheme,
        });
      }
    };

    loadThemes();
  }, []);

  const addTheme = async (theme: CustomTheme) => {
    const user = auth.currentUser;
    if (!user) return;

    const userThemesRef = doc(db, 'userThemes', user.uid);
    const newThemes = [...themes, theme];
    setThemes(newThemes);
    await setDoc(userThemesRef, { themes: newThemes, currentTheme }, { merge: true });
  };

  const updateTheme = async (theme: CustomTheme) => {
    const user = auth.currentUser;
    if (!user) return;

    const userThemesRef = doc(db, 'userThemes', user.uid);
    const newThemes = themes.map(t => t.name === theme.name ? theme : t);
    setThemes(newThemes);
    if (currentTheme.name === theme.name) {
      setCurrentTheme(theme);
    }
    await setDoc(userThemesRef, { themes: newThemes, currentTheme: theme }, { merge: true });
  };

  const deleteTheme = async (themeName: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const userThemesRef = doc(db, 'userThemes', user.uid);
    const newThemes = themes.filter(t => t.name !== themeName);
    setThemes(newThemes);
    if (currentTheme.name === themeName) {
      setCurrentTheme(defaultTheme);
    }
    await setDoc(userThemesRef, { themes: newThemes, currentTheme: defaultTheme }, { merge: true });
  };

  const muiTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: currentTheme.colors.background,
        paper: currentTheme.colors.schema,
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
        setCurrentTheme,
      }}
    >
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 