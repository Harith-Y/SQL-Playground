import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
  Code as CodeIcon,
  DataObject as DataObjectIcon,
  TableChart as TableChartIcon,
} from '@mui/icons-material';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const tutorials: Tutorial[] = [
  {
    id: 'basic-select',
    title: 'Basic SELECT Queries',
    description: 'Learn how to retrieve data from tables using SELECT statements, WHERE clauses, and basic filtering.',
    icon: <TableChartIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Beginner',
  },
  {
    id: 'joins',
    title: 'SQL JOINs',
    description: 'Master different types of JOINs (INNER, LEFT, RIGHT, FULL) and how to combine data from multiple tables.',
    icon: <DataObjectIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Intermediate',
  },
  {
    id: 'aggregation',
    title: 'Aggregation Functions',
    description: 'Learn to use GROUP BY, HAVING, and aggregate functions like COUNT, SUM, AVG, MAX, and MIN.',
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Intermediate',
  },
  {
    id: 'subqueries',
    title: 'Subqueries',
    description: 'Explore nested queries, correlated subqueries, and how to use them effectively in your SQL statements.',
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
];

const Tutorials: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        SQL Tutorials
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Learn SQL through interactive tutorials and practice exercises
      </Typography>
      
      <Grid container spacing={3}>
        {tutorials.map((tutorial) => (
          <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {tutorial.icon}
                  <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                    {tutorial.title}
                  </Typography>
                </Box>
                <Typography color="text.secondary" paragraph>
                  {tutorial.description}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'inline-block',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: tutorial.difficulty === 'Beginner' ? 'success.light' :
                             tutorial.difficulty === 'Intermediate' ? 'warning.light' :
                             'error.light',
                    color: 'white',
                  }}
                >
                  {tutorial.difficulty}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/tutorials/${tutorial.id}`)}
                >
                  Start Tutorial
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Tutorials; 