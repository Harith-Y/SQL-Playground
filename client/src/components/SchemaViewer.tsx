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
  const [expandedTables, setExpandedTables] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleTableClick = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName]
    );
  };

  const handleSave = () => {
    exportState(schema, queries);
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importState(file)
        .then((state) => {
          if (onSchemaLoad) onSchemaLoad(state.schema);
          if (onQueriesLoad) onQueriesLoad(state.queries);
        })
        .catch((error) => {
          console.error('Error loading state:', error);
          // You might want to show an error message to the user here
        });
    }
  };

  return (
    <Paper sx={{ width: '50%', overflow: 'hidden' }}>
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">Database Schema</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              variant="outlined"
            >
              Save
            </Button>
            <Button
              size="small"
              startIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              variant="outlined"
            >
              Load
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLoad}
              accept=".json"
              style={{ display: 'none' }}
            />
          </Stack>
        </Stack>
      </Box>
      <List sx={{ overflow: 'auto', height: 'calc(100% - 41px)' }}>
        {Object.entries(schema.tables).map(([tableName, table]) => (
          <React.Fragment key={tableName}>
            <ListItem
              component="button"
              onClick={() => handleTableClick(tableName)}
            >
              <ListItemIcon>
                <TableIcon />
              </ListItemIcon>
              <ListItemText primary={tableName} />
              {expandedTables.includes(tableName) ? <ExpandIcon /> : <CollapseIcon />}
            </ListItem>
            <Collapse in={expandedTables.includes(tableName)}>
              <List component="div" disablePadding>
                {table.columns.map((column) => (
                  <ListItem
                    key={column.name}
                    sx={{ pl: 4 }}
                  >
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
    </Paper>
  );
};

export default SchemaViewer;
