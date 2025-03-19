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
} from '@mui/material';

import {
  TableChart as TableIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowRight as CollapseIcon,
} from '@mui/icons-material';

const SchemaViewer = () => {
  const [expandedTables, setExpandedTables] = React.useState<string[]>(['users']);

  // Example schema - this will be replaced with actual database schema when in production phase.
  const schema = {
    users: {
      columns: [
        { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY AUTOINCREMENT' },
        { name: 'username', type: 'TEXT', constraints: 'UNIQUE NOT NULL' },
        { name: 'email', type: 'TEXT', constraints: 'UNIQUE NOT NULL' },
        { name: 'password', type: 'TEXT', constraints: 'NOT NULL' },
      ],
    },
    saved_queries: {
      columns: [
        { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY AUTOINCREMENT' },
        { name: 'user_id', type: 'INTEGER', constraints: 'FOREIGN KEY' },
        { name: 'title', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'query', type: 'TEXT', constraints: 'NOT NULL' },
      ],
    },
  };

  const handleTableClick = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName]
    );
  };

  return (
    <Paper sx={{ width: '50%', overflow: 'hidden' }}>
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1">Database Schema</Typography>
      </Box>
      <List sx={{ overflow: 'auto', height: 'calc(100% - 41px)' }}>
        {Object.entries(schema).map(([tableName, table]) => (
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
