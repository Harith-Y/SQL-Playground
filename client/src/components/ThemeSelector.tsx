import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton as MuiIconButton,
  Divider,
} from '@mui/material';
import { ChromePicker, ColorResult } from 'react-color';
import {
  Palette as PaletteIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeColors {
  editor: string;
  schema: string;
  results: string;
  background: string;
  text: string;
}

interface Theme {
  name: string;
  colors: ThemeColors;
}

const ThemeSelector: React.FC = () => {
  const { currentTheme, themes, addTheme, updateTheme, deleteTheme, setCurrentTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentColorKey, setCurrentColorKey] = useState<keyof ThemeColors>('editor');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (theme: Theme) => {
    setCurrentTheme(theme);
    handleMenuClose();
  };

  const handleNewTheme = () => {
    setEditingTheme({
      name: '',
      colors: {
        editor: '#1e1e1e',
        schema: '#2d2d2d',
        results: '#2d2d2d',
        background: '#1a1a1a',
        text: '#ffffff',
      },
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleEditTheme = (theme: Theme) => {
    setEditingTheme({ ...theme });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingTheme(null);
  };

  const handleSaveTheme = async () => {
    if (!editingTheme?.name.trim()) return;

    try {
      if (themes.some(t => t.name === editingTheme.name && t !== editingTheme)) {
        await updateTheme(editingTheme);
      } else {
        await addTheme(editingTheme);
      }
      handleDialogClose();
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const handleColorChange = (color: ColorResult) => {
    if (!editingTheme) return;
    
    setCurrentColor(color.hex);
    setEditingTheme({
      ...editingTheme,
      colors: {
        ...editingTheme.colors,
        [currentColorKey]: color.hex,
      },
    });
  };

  const openColorPicker = (colorKey: keyof ThemeColors, color: string) => {
    setCurrentColorKey(colorKey);
    setCurrentColor(color);
    setColorPickerOpen(true);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleMenuOpen}
        sx={{ ml: 2 }}
      >
        <PaletteIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleNewTheme}>
          <AddIcon sx={{ mr: 1 }} />
          New Theme
        </MenuItem>
        <Divider />
        {themes.map((theme) => (
          <MenuItem
            key={theme.name}
            selected={theme.name === currentTheme.name}
            onClick={() => handleThemeSelect(theme)}
          >
            <ListItemText primary={theme.name} />
            <MuiIconButton
              edge="end"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEditTheme(theme);
              }}
            >
              <EditIcon />
            </MuiIconButton>
            {theme.name !== 'Default Dark' && (
              <MuiIconButton
                edge="end"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTheme(theme.name);
                }}
              >
                <DeleteIcon />
              </MuiIconButton>
            )}
          </MenuItem>
        ))}
      </Menu>

      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTheme && themes.some(t => t.name === editingTheme.name) ? 'Edit Theme' : 'New Theme'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Theme Name"
            fullWidth
            value={editingTheme?.name || ''}
            onChange={(e) => editingTheme && setEditingTheme({ ...editingTheme, name: e.target.value })}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Colors</Typography>
            <List>
              {editingTheme && Object.entries(editingTheme.colors).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText
                    primary={key.charAt(0).toUpperCase() + key.slice(1)}
                    secondary={
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: value,
                          border: '1px solid #ccc',
                          borderRadius: 1,
                        }}
                      />
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openColorPicker(key as keyof ThemeColors, value)}
                    >
                      Change
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveTheme} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {colorPickerOpen && (
        <Dialog open={colorPickerOpen} onClose={() => setColorPickerOpen(false)}>
          <DialogContent>
            <ChromePicker
              color={currentColor}
              onChange={handleColorChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setColorPickerOpen(false)}>Done</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ThemeSelector; 