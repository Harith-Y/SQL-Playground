import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Button,
  Stack,
} from '@mui/material';
import {
  TableChart as TableIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowRight as CollapseIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { exportState, importState, SchemaDefinition } from '../services/exportService';
import { useTheme } from '../contexts/ThemeContext';

interface SchemaViewerProps {
  schema: SchemaDefinition;
  queries: Array<{ title: string; query: string }>;
  onSchemaLoad?: (schema: SchemaDefinition) => void;
  onQueriesLoad?: (queries: Array<{ title: string; query: string }>) => void;
}

const SYSTEM_TABLES = ['users', 'saved_queries'];

const SchemaViewer: React.FC<SchemaViewerProps> = ({
  schema,
  queries,
  onSchemaLoad,
  onQueriesLoad,
}) => {
  const { currentTheme } = useTheme();
  const [expandedTables, setExpandedTables] = React.useState<Record<string, boolean>>({});

  const handleTableClick = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const handleExport = () => {
    exportState(schema, queries);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { schema: importedSchema, queries: importedQueries } = await importState(file);
        onSchemaLoad?.(importedSchema);
        onQueriesLoad?.(importedQueries);
      } catch (error) {
        console.error('Error importing schema:', error);
      }
    }
  };

  // Filter out system tables
  const userTables = Object.entries(schema.tables).filter(
    ([tableName]) => !SYSTEM_TABLES.includes(tableName)
  );

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: currentTheme.colors.schema,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ color: currentTheme.colors.text }}>Database Schema</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleExport}
            sx={{ color: currentTheme.colors.text }}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            size="small"
            component="label"
            startIcon={<UploadIcon />}
            sx={{ color: currentTheme.colors.text }}
          >
            Import
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleImport}
            />
          </Button>
        </Stack>
      </Box>
      <Box sx={{ 
        overflow: 'auto', 
        flexGrow: 1,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: currentTheme.colors.background,
        },
        '&::-webkit-scrollbar-thumb': {
          background: currentTheme.colors.text,
          opacity: 0.5,
          borderRadius: '4px',
        },
      }}>
        {userTables.length > 0 ? (
          <List sx={{ width: '100%' }}>
            {userTables.map(([tableName, table]) => (
              <React.Fragment key={tableName}>
                <ListItem
                  button
                  onClick={() => handleTableClick(tableName)}
                  sx={{ 
                    pl: 2,
                    '&:hover': {
                      backgroundColor: currentTheme.colors.background,
                      opacity: 0.8,
                    },
                  }}
                >
                  <ListItemIcon>
                    <TableIcon sx={{ color: currentTheme.colors.text }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={tableName}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 'medium',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: currentTheme.colors.text,
                      }
                    }}
                  />
                  {expandedTables[tableName] ? 
                    <ExpandIcon sx={{ color: currentTheme.colors.text }} /> : 
                    <CollapseIcon sx={{ color: currentTheme.colors.text }} />
                  }
                </ListItem>
                <Collapse in={expandedTables[tableName]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {table.columns.map((column) => (
                      <ListItem 
                        key={column.name} 
                        sx={{ 
                          pl: 6,
                          '&:hover': {
                            backgroundColor: currentTheme.colors.background,
                            opacity: 0.8,
                          },
                        }}
                      >
                        <ListItemText
                          primary={column.name}
                          secondary={`${column.type} ${column.constraints}`}
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: 'medium',
                              color: currentTheme.colors.text,
                            }
                          }}
                          secondaryTypographyProps={{
                            sx: {
                              fontSize: '0.75rem',
                              color: currentTheme.colors.text,
                              opacity: 0.7,
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: currentTheme.colors.text, opacity: 0.7 }}>
              No tables to display
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default SchemaViewer;
