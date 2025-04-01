import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface TableData {
  id: number;
  [key: string]: any;
}

interface VisualizationProps {
  query: string;
  result: any;
  tables: {
    [key: string]: TableData[];
  };
}

const QueryVisualization: React.FC<VisualizationProps> = ({ query, result, tables }) => {
  const [visualizationType, setVisualizationType] = useState<'join' | 'filter' | 'aggregate' | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Determine visualization type based on query
    const queryLower = query.toLowerCase();
    if (queryLower.includes('join')) {
      setVisualizationType('join');
    } else if (queryLower.includes('where')) {
      setVisualizationType('filter');
    } else if (queryLower.includes('count') || queryLower.includes('group by')) {
      setVisualizationType('aggregate');
    }
  }, [query]);

  const renderJoinVisualization = () => {
    const tableNames = Object.keys(tables);
    if (tableNames.length < 2) return null;

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, p: 2 }}>
        {tableNames.map((tableName: string, index: number) => (
          <motion.div
            key={tableName}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Paper sx={{ p: 2, minWidth: 150 }}>
              <Typography variant="subtitle1" gutterBottom>
                {tableName}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {tables[tableName].slice(0, 3).map((row: TableData, rowIndex: number) => (
                  <motion.div
                    key={rowIndex}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
                  >
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 1, 
                        bgcolor: animationStep > rowIndex ? 'primary.light' : 'background.paper',
                        color: animationStep > rowIndex ? 'primary.contrastText' : 'text.primary'
                      }}
                    >
                      {Object.entries(row).map(([key, value]) => (
                        <Typography key={key} variant="body2">
                          {`${key}: ${value}`}
                        </Typography>
                      ))}
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </Paper>
          </motion.div>
        ))}
        {animationStep > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
              <Typography variant="subtitle1">Joined Result</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {result?.results?.slice(0, 3).map((row: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Paper variant="outlined" sx={{ p: 1 }}>
                      {Object.entries(row).map(([key, value]) => (
                        <Typography key={key} variant="body2">
                          {`${key}: ${value}`}
                        </Typography>
                      ))}
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </Paper>
          </motion.div>
        )}
      </Box>
    );
  };

  const renderFilterVisualization = () => {
    const tableName = Object.keys(tables)[0];
    if (!tableName) return null;

    return (
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {tableName}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {tables[tableName].map((row: TableData, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  backgroundColor: result?.results?.some((r: any) => 
                    Object.entries(r).every(([key, value]) => row[key] === value)
                  ) ? '#4caf50' : '#f44336'
                }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Paper variant="outlined" sx={{ p: 1 }}>
                  {Object.entries(row).map(([key, value]) => (
                    <Typography key={key} variant="body2">
                      {`${key}: ${value}`}
                    </Typography>
                  ))}
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderAggregateVisualization = () => {
    const tableName = Object.keys(tables)[0];
    if (!tableName) return null;

    return (
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {tableName}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {tables[tableName].map((row: TableData, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Paper variant="outlined" sx={{ p: 1 }}>
                  {Object.entries(row).map(([key, value]) => (
                    <Typography key={key} variant="body2">
                      {`${key}: ${value}`}
                    </Typography>
                  ))}
                </Paper>
              </motion.div>
            ))}
          </Box>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="subtitle1">Aggregated Result</Typography>
              {result?.results?.map((row: any, index: number) => (
                <Paper key={index} variant="outlined" sx={{ p: 1, mt: 1 }}>
                  {Object.entries(row).map(([key, value]) => (
                    <Typography key={key} variant="body2">
                      {`${key}: ${value}`}
                    </Typography>
                  ))}
                </Paper>
              ))}
            </Paper>
          </motion.div>
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <AnimatePresence>
        {visualizationType === 'join' && renderJoinVisualization()}
        {visualizationType === 'filter' && renderFilterVisualization()}
        {visualizationType === 'aggregate' && renderAggregateVisualization()}
      </AnimatePresence>
    </Box>
  );
};

export default QueryVisualization; 