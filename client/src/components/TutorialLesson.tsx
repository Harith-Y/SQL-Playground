import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import SQLEditor from './SQLEditor';
import ResultsPanel from './ResultsPanel';
import QueryVisualization from './QueryVisualization';

interface Lesson {
  id: string;
  title: string;
  content: string;
  exampleQuery: string;
  exerciseQuery: string;
  expectedResult: string;
  hint?: string;
}

const lessons: Record<string, Lesson[]> = {
  'basic-select': [
    {
      id: 'select-basics',
      title: 'Basic SELECT Statement',
      content: 'The SELECT statement is used to retrieve data from a database. The basic syntax is: SELECT column1, column2 FROM table_name;',
      exampleQuery: 'SELECT username, email FROM users;',
      exerciseQuery: 'SELECT * FROM users;',
      expectedResult: 'SELECT * FROM users;',
    },
    {
      id: 'where-clause',
      title: 'WHERE Clause',
      content: 'The WHERE clause is used to filter records. It extracts only those records that fulfill a specified condition.',
      exampleQuery: 'SELECT username FROM users WHERE email LIKE "%@example.com";',
      exerciseQuery: 'SELECT username FROM users WHERE id > 1;',
      expectedResult: 'SELECT username FROM users WHERE id > 1;',
    },
  ],
  'joins': [
    {
      id: 'inner-join',
      title: 'INNER JOIN',
      content: 'INNER JOIN returns records that have matching values in both tables.',
      exampleQuery: 'SELECT users.username, saved_queries.title FROM users INNER JOIN saved_queries ON users.id = saved_queries.user_id;',
      exerciseQuery: 'SELECT users.username, saved_queries.title FROM users INNER JOIN saved_queries ON users.id = saved_queries.user_id;',
      expectedResult: 'SELECT users.username, saved_queries.title FROM users INNER JOIN saved_queries ON users.id = saved_queries.user_id;',
    },
    {
      id: 'left-join',
      title: 'LEFT JOIN',
      content: 'LEFT JOIN returns all records from the left table and the matched records from the right table.',
      exampleQuery: 'SELECT users.username, saved_queries.title FROM users LEFT JOIN saved_queries ON users.id = saved_queries.user_id;',
      exerciseQuery: 'SELECT users.username, saved_queries.title FROM users LEFT JOIN saved_queries ON users.id = saved_queries.user_id;',
      expectedResult: 'SELECT users.username, saved_queries.title FROM users LEFT JOIN saved_queries ON users.id = saved_queries.user_id;',
    },
  ],
  'aggregation': [
    {
      id: 'count-basics',
      title: 'COUNT Function',
      content: 'COUNT() function returns the number of rows that match a specified condition.',
      exampleQuery: 'SELECT COUNT(*) as total_users FROM users;',
      exerciseQuery: 'SELECT COUNT(*) as total_users FROM users;',
      expectedResult: 'SELECT COUNT(*) as total_users FROM users;',
    },
    {
      id: 'group-by',
      title: 'GROUP BY Clause',
      content: 'GROUP BY groups rows that have the same values into summary rows.',
      exampleQuery: 'SELECT COUNT(*) as query_count, user_id FROM saved_queries GROUP BY user_id;',
      exerciseQuery: 'SELECT COUNT(*) as query_count, user_id FROM saved_queries GROUP BY user_id;',
      expectedResult: 'SELECT COUNT(*) as query_count, user_id FROM saved_queries GROUP BY user_id;',
    },
  ],
  'subqueries': [
    {
      id: 'basic-subquery',
      title: 'Basic Subquery',
      content: 'A subquery is a query nested inside another query.',
      exampleQuery: 'SELECT username FROM users WHERE id IN (SELECT user_id FROM saved_queries);',
      exerciseQuery: 'SELECT username FROM users WHERE id IN (SELECT user_id FROM saved_queries);',
      expectedResult: 'SELECT username FROM users WHERE id IN (SELECT user_id FROM saved_queries);',
    },
    {
      id: 'correlated-subquery',
      title: 'Correlated Subquery',
      content: 'A correlated subquery is a subquery that uses values from the outer query.',
      exampleQuery: 'SELECT username FROM users u WHERE EXISTS (SELECT 1 FROM saved_queries s WHERE s.user_id = u.id);',
      exerciseQuery: 'SELECT username FROM users u WHERE EXISTS (SELECT 1 FROM saved_queries s WHERE s.user_id = u.id);',
      expectedResult: 'SELECT username FROM users u WHERE EXISTS (SELECT 1 FROM saved_queries s WHERE s.user_id = u.id);',
    },
  ],
};

const TutorialLesson: React.FC = () => {
  const { tutorialId } = useParams<{ tutorialId: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const tutorialLessons = tutorialId ? lessons[tutorialId] : [];
  const currentLesson = tutorialLessons[activeStep];

  // Sample table data for visualization
  const sampleTables = {
    users: [
      { id: 1, username: 'john_doe', email: 'john@example.com' },
      { id: 2, username: 'jane_smith', email: 'jane@example.com' },
      { id: 3, username: 'bob_wilson', email: 'bob@example.com' },
    ],
    saved_queries: [
      { id: 1, user_id: 1, title: 'My First Query', query: 'SELECT * FROM users;' },
      { id: 2, user_id: 1, title: 'User Count', query: 'SELECT COUNT(*) FROM users;' },
      { id: 3, user_id: 2, title: 'Email List', query: 'SELECT email FROM users;' },
    ],
  };

  const handleNext = () => {
    if (activeStep === tutorialLessons.length - 1) {
      navigate('/tutorials');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
      setCurrentQuery('');
      setQueryResult(null);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setCurrentQuery('');
    setQueryResult(null);
  };

  const handleExecuteQuery = async () => {
    setIsLoading(true);

    try {
      // Here you would typically call your API to execute the query
      // For now, we'll simulate a successful query with sample data
      setQueryResult({
        success: true,
        results: [
          { username: 'john_doe', email: 'john@example.com', title: 'My First Query' },
          { username: 'john_doe', email: 'john@example.com', title: 'User Count' },
          { username: 'jane_smith', email: 'jane@example.com', title: 'Email List' },
        ],
      });
    } catch (err) {
      // Handle errors appropriately
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentLesson) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Tutorial not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {currentLesson.title}
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {tutorialLessons.map((lesson) => (
          <Step key={lesson.id}>
            <StepLabel>{lesson.title}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" paragraph>
          {currentLesson.content}
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          Example Query:
        </Typography>
        <Box sx={{ mb: 3, height: '200px' }}>
          <SQLEditor
            value={currentLesson.exampleQuery}
            onChange={() => {}}
            isLoading={false}
            onExecuteQuery={() => {}}
            readOnly
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Practice Exercise:
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {currentLesson.hint}
        </Typography>
        
        <Box sx={{ mb: 3, height: '200px' }}>
          <SQLEditor
            value={currentQuery}
            onChange={(value) => setCurrentQuery(value || '')}
            isLoading={isLoading}
            onExecuteQuery={handleExecuteQuery}
          />
        </Box>

        <Box sx={{ mb: 3, height: '300px' }}>
          <ResultsPanel
            result={queryResult}
            isLoading={isLoading}
          />
        </Box>

        {queryResult && (
          <QueryVisualization
            query={currentQuery}
            result={queryResult}
            tables={sampleTables}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === tutorialLessons.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TutorialLesson; 
