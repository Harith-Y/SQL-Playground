import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Box,
  TextField,
} from '@mui/material';
import { Close, ContentCopy, Star, StarBorder } from '@mui/icons-material';
import axios from 'axios';
import { auth } from '../services/firebase';

interface SavedQueriesProps {
  open: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

interface SavedQuery {
  id: number;
  title: string;
  query: string;
  created_at: string;
}

const SavedQueries: React.FC<SavedQueriesProps> = ({ open, onClose, onSelectQuery }) => {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQueryTitle, setNewQueryTitle] = useState('');

  useEffect(() => {
    if (open) {
      fetchQueries();
    }
  }, [open]);

  const fetchQueries = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError('User must be logged in');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/saved-queries`, {
        params: { userId: user.uid }
      });
      setQueries(response.data.queries);
      setError(null);
    } catch (err) {
      setError('Failed to fetch saved queries');
      console.error('Error fetching saved queries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuery = async (title: string, query: string) => {
    const user = auth.currentUser;
    if (!user) {
      setError('User must be logged in');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/saved-queries`, {
        userId: user.uid,
        title,
        query
      });
      fetchQueries();
      setNewQueryTitle('');
    } catch (err) {
      setError('Failed to save query');
      console.error('Error saving query:', err);
    }
  };

  const handleDeleteQuery = async (id: number) => {
    const user = auth.currentUser;
    if (!user) {
      setError('User must be logged in');
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/saved-queries/${id}`, {
        params: { userId: user.uid }
      });
      fetchQueries();
    } catch (err) {
      setError('Failed to delete query');
      console.error('Error deleting query:', err);
    }
  };

  const handleCopyQuery = (query: string) => {
    navigator.clipboard.writeText(query);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Convert to IST (GMT+5:30)
    const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    return istDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Saved Queries</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography>Loading saved queries...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : queries.length === 0 ? (
          <Typography>No saved queries</Typography>
        ) : (
          <List>
            {queries.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => handleCopyQuery(item.query)}
                      title="Copy query"
                    >
                      <ContentCopy />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteQuery(item.id)}
                      title="Delete query"
                    >
                      <Close />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box>
                      <Typography variant="subtitle1" component="span">
                        {item.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        Saved: {formatDate(item.created_at)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      component="pre"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                      }}
                    >
                      {item.query}
                    </Typography>
                  }
                  onClick={() => onSelectQuery(item.query)}
                  sx={{ cursor: 'pointer' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavedQueries; 