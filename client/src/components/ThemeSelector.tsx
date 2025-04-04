import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaPalette } from 'react-icons/fa';
import styled, { DefaultTheme } from 'styled-components';

const ThemeButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;

  &:hover {
    opacity: 0.8;
  }
`;

const ThemePanel = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${props => props.theme.colors?.background || '#fff'};
  border: 1px solid ${props => props.theme.colors?.secondary || '#ddd'};
  border-radius: 4px;
  padding: 1rem;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  min-width: 250px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const ThemeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1rem;
`;

const ThemeOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors?.secondary + '20' || '#f0f0f0'};
  }
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 1px solid #ddd;
`;

const ThemeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  padding: 6px;
  border: 1px solid ${props => props.theme.colors?.secondary || '#ddd'};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px;
  background-color: ${props => props.theme.colors?.primary || '#007bff'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const ThemeSelector: React.FC = () => {
  const { currentTheme, savedThemes, setCurrentTheme, saveTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [newTheme, setNewTheme] = useState<{ colors: DefaultTheme['colors'] }>({
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      text: '#212529',
      accent: '#28a745'
    }
  });
  const [themeName, setThemeName] = useState('');

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveTheme({
        id: `custom-${Date.now()}`,
        name: themeName,
        colors: newTheme.colors
      });
      setThemeName('');
      setNewTheme({
        colors: { ...currentTheme.colors }
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <ThemeButton onClick={() => setIsOpen(!isOpen)}>
        <FaPalette />
      </ThemeButton>

      <ThemePanel isOpen={isOpen}>
        <h3>Select Theme</h3>
        <ThemeList>
          {savedThemes.map(theme => (
            <ThemeOption
              key={theme.id}
              onClick={() => {
                setCurrentTheme(theme);
                setIsOpen(false);
              }}
            >
              <span>{theme.name}</span>
              <ColorPreview color={theme.colors.primary} />
            </ThemeOption>
          ))}
        </ThemeList>

        <h3>Create New Theme</h3>
        <ThemeForm onSubmit={handleSaveTheme}>
          <Input
            type="text"
            placeholder="Theme Name"
            value={themeName}
            onChange={e => setThemeName(e.target.value)}
            required
          />
          {Object.entries(newTheme.colors).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ flex: 1 }}>{key}:</label>
              <Input
                type="color"
                value={value}
                onChange={e =>
                  setNewTheme({
                    colors: { ...newTheme.colors, [key]: e.target.value }
                  })
                }
              />
            </div>
          ))}
          <Button type="submit">Save Theme</Button>
        </ThemeForm>
      </ThemePanel>
    </div>
  );
};

export default ThemeSelector; 