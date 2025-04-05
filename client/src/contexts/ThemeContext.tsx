import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(defaultTheme);
  const [themes, setThemes] = useState<CustomTheme[]>([defaultTheme]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Load user's themes from Firestore
        const userDocRef = doc(db, 'userThemes', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setThemes(userData.themes || [defaultTheme]);
          setCurrentTheme(userData.currentTheme || defaultTheme);
        } else {
          // Create new document for user with default theme
          await setDoc(userDocRef, {
            themes: [defaultTheme],
            currentTheme: defaultTheme,
          });
        }
      } else {
        // Reset to default theme when user logs out
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

    const userDocRef = doc(db, 'userThemes', user.uid);
    await updateDoc(userDocRef, {
      themes: newThemes,
    });
  };

  const updateTheme = async (theme: CustomTheme) => {
    const user = auth.currentUser;
    if (!user) return;

    const newThemes = themes.map(t => t.name === theme.name ? theme : t);
    setThemes(newThemes);

    const userDocRef = doc(db, 'userThemes', user.uid);
    await updateDoc(userDocRef, {
      themes: newThemes,
    });
  };

  const deleteTheme = async (themeName: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const newThemes = themes.filter(t => t.name !== themeName);
    setThemes(newThemes);

    const userDocRef = doc(db, 'userThemes', user.uid);
    await updateDoc(userDocRef, {
      themes: newThemes,
    });
  };

  const handleSetCurrentTheme = async (theme: CustomTheme) => {
    const user = auth.currentUser;
    if (!user) return;

    setCurrentTheme(theme);

    const userDocRef = doc(db, 'userThemes', user.uid);
    await updateDoc(userDocRef, {
      currentTheme: theme,
    });
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