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
} from '@mui/material';
import { Close, ContentCopy } from '@mui/icons-material';
import axios from 'axios';
import { auth } from '../services/firebase';

interface QueryHistoryProps {
  open: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

interface HistoryItem {
  id: number;
  query: string;
  executed_at: string;
}

const QueryHistory: React.FC<QueryHistoryProps> = ({ open, onClose, onSelectQuery }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open]);

  const fetchHistory = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError('User must be logged in');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/history`, {
        params: { userId: user.uid }
      });
      setHistory(response.data.history);
      setError(null);
    } catch (err) {
      setError('Failed to fetch query history');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
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

  const handleCopyQuery = (query: string) => {
    navigator.clipboard.writeText(query);
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
          <Typography variant="h6">Query History</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography>Loading history...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : history.length === 0 ? (
          <Typography>No queries in history</Typography>
        ) : (
          <List>
            {history.map((item) => (
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
                  <IconButton
                    edge="end"
                    onClick={() => handleCopyQuery(item.query)}
                    title="Copy query"
                  >
                    <ContentCopy />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
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
                  secondary={formatDate(item.executed_at)}
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

export default QueryHistory; 