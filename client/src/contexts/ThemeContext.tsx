import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { DefaultTheme } from 'styled-components';

interface Theme extends DefaultTheme {
  id: string;
  name: string;
}

interface ThemeContextType {
  currentTheme: Theme;
  savedThemes: Theme[];
  setCurrentTheme: (theme: Theme) => void;
  saveTheme: (theme: Theme) => Promise<void>;
  deleteTheme: (themeId: string) => Promise<void>;
}

const defaultTheme: Theme = {
  id: 'default-light',
  name: 'Light',
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#212529',
    accent: '#28a745'
  }
};

const darkTheme: Theme = {
  id: 'default-dark',
  name: 'Dark',
  colors: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    background: '#212529',
    text: '#f8f9fa',
    accent: '#198754'
  }
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [savedThemes, setSavedThemes] = useState<Theme[]>([defaultTheme, darkTheme]);

  useEffect(() => {
    // Load user's themes when component mounts
    const loadUserThemes = async () => {
      try {
        const response = await axios.get('/api/themes');
        if (response.data.themes) {
          setSavedThemes([defaultTheme, darkTheme, ...response.data.themes]);
        }
      } catch (error) {
        console.error('Failed to load themes:', error);
      }
    };

    loadUserThemes();
  }, []);

  const saveTheme = async (theme: Theme) => {
    try {
      const response = await axios.post('/api/themes', theme);
      setSavedThemes(prev => [...prev, response.data.theme]);
    } catch (error) {
      console.error('Failed to save theme:', error);
      throw error;
    }
  };

  const deleteTheme = async (themeId: string) => {
    try {
      await axios.delete(`/api/themes/${themeId}`);
      setSavedThemes(prev => prev.filter(theme => theme.id !== themeId));
    } catch (error) {
      console.error('Failed to delete theme:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, savedThemes, setCurrentTheme, saveTheme, deleteTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 