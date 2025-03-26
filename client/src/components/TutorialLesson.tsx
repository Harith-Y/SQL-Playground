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
    // Add more lessons as needed
  ],
  // Add more tutorial sections as needed
};

const TutorialLesson: React.FC = () => {
  const { tutorialId } = useParams<{ tutorialId: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tutorialLessons = tutorialId ? lessons[tutorialId] : [];
  const currentLesson = tutorialLessons[activeStep];

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
    setError(null);

    try {
      // Here you would typically call your API to execute the query
      // For now, we'll just simulate a successful query
      setQueryResult({
        success: true,
        results: [
          { username: 'john_doe', email: 'john@example.com' },
          { username: 'jane_smith', email: 'jane@example.com' },
        ],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
        <Box sx={{ mb: 3 }}>
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
        
        <Box sx={{ mb: 3 }}>
          <SQLEditor
            value={currentQuery}
            onChange={(value) => setCurrentQuery(value || '')}
            isLoading={isLoading}
            onExecuteQuery={handleExecuteQuery}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <ResultsPanel
            result={queryResult}
            isLoading={isLoading}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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