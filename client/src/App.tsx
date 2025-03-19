import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import SQLEditor from './components/SQLEditor';
import ResultsPanel from './components/ResultsPanel';
import SchemaViewer from './components/SchemaViewer';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar />
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1,
          gap: 2,
          p: 2,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            width: '50%', 
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <SQLEditor />
            <ResultsPanel />
          </Box>
          <SchemaViewer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
