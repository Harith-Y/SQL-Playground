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

  return (
    <Paper
      elevation={3}
      sx={{
        width: '30%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: currentTheme.colors.schema,
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Database Schema</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            size="small"
            component="label"
            startIcon={<UploadIcon />}
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
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List>
          {Object.entries(schema.tables).map(([tableName, table]) => (
            <React.Fragment key={tableName}>
              <ListItem
                button
                onClick={() => handleTableClick(tableName)}
                sx={{ pl: 2 }}
              >
                <ListItemIcon>
                  <TableIcon />
                </ListItemIcon>
                <ListItemText primary={tableName} />
                {expandedTables[tableName] ? <ExpandIcon /> : <CollapseIcon />}
              </ListItem>
              <Collapse in={expandedTables[tableName]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {table.columns.map((column) => (
                    <ListItem key={column.name} sx={{ pl: 6 }}>
                      <ListItemText
                        primary={column.name}
                        secondary={`${column.type} ${column.constraints}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default SchemaViewer;
