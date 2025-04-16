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
  BugReport as BugReportIcon,
  Functions as FunctionsIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  Storage as StorageIcon,
  AutoFixHigh as AutoFixHighIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  ViewQuilt as ViewQuiltIcon,
  Tune as TuneIcon,
  Warehouse as WarehouseIcon,
  Lock as LockIcon,
  Backup as BackupIcon,
  Sync as SyncIcon,
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
  {
    id: 'debugging',
    title: 'SQL Debugging',
    description: 'Learn how to identify and fix common SQL errors, understand error messages, and debug complex queries.',
    icon: <BugReportIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Intermediate',
  },
  {
    id: 'window-functions',
    title: 'Window Functions',
    description: 'Master advanced analytical functions like ROW_NUMBER, RANK, DENSE_RANK, and running totals.',
    icon: <FunctionsIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'ctes',
    title: 'Common Table Expressions',
    description: 'Learn to use CTEs to simplify complex queries and create recursive queries for hierarchical data.',
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'indexes',
    title: 'Database Indexes',
    description: 'Understand how indexes work, when to use them, and their impact on query performance.',
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Intermediate',
  },
  {
    id: 'transactions',
    title: 'Transactions and ACID',
    description: 'Learn about database transactions, ACID properties, and how to maintain data integrity.',
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Intermediate',
  },
  {
    id: 'views',
    title: 'Database Views',
    description: 'Create and use views to simplify complex queries and implement security through abstraction.',
    icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Intermediate',
  },
  {
    id: 'stored-procedures',
    title: 'Stored Procedures',
    description: 'Learn to create and use stored procedures for reusable database operations.',
    icon: <StorageIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'triggers',
    title: 'Database Triggers',
    description: 'Understand how to use triggers for automatic data validation and business logic enforcement.',
    icon: <AutoFixHighIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'temporal-tables',
    title: 'Temporal Tables',
    description: 'Learn to track and query historical data using system-versioned temporal tables.',
    icon: <HistoryIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'json-handling',
    title: 'JSON in SQL',
    description: 'Master JSON data handling, including storage, querying, and manipulation of JSON documents.',
    icon: <DataObjectIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Intermediate',
  },
  {
    id: 'full-text-search',
    title: 'Full-Text Search',
    description: 'Implement efficient text search capabilities using full-text indexes and search functions.',
    icon: <SearchIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Intermediate',
  },
  {
    id: 'partitioning',
    title: 'Table Partitioning',
    description: 'Learn to improve query performance and manageability through table partitioning strategies.',
    icon: <ViewModuleIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'materialized-views',
    title: 'Materialized Views',
    description: 'Understand how to use materialized views for pre-computed results and improved performance.',
    icon: <ViewQuiltIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'query-optimization',
    title: 'Query Optimization',
    description: 'Master techniques for analyzing and optimizing SQL query performance.',
    icon: <TuneIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'data-warehousing',
    title: 'Data Warehousing',
    description: 'Learn about star schemas, fact tables, dimension tables, and ETL processes.',
    icon: <WarehouseIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'database-security',
    title: 'Database Security',
    description: 'Implement comprehensive security measures including encryption, access control, and auditing.',
    icon: <LockIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'backup-recovery',
    title: 'Backup and Recovery',
    description: 'Learn strategies for database backup, point-in-time recovery, and disaster recovery.',
    icon: <BackupIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Intermediate',
  },
  {
    id: 'replication',
    title: 'Database Replication',
    description: 'Understand different replication strategies for high availability and read scaling.',
    icon: <SyncIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'advanced-joins',
    title: 'Advanced SQL Joins',
    description: 'Master complex join operations including self-joins, cross joins, and hierarchical data structures.',
    icon: <DataObjectIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'advanced-aggregation',
    title: 'Advanced Aggregation',
    description: 'Learn advanced aggregation techniques including pivot tables, ROLLUP, CUBE, and GROUPING SETS.',
    icon: <FunctionsIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis with SQL',
    description: 'Master time series analysis, customer analytics, and business intelligence using SQL.',
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    difficulty: 'Advanced',
  }
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
