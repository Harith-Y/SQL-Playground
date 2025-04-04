import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
  Code as CodeIcon,
  DataObject as DataObjectIcon,
  TableChart as TableChartIcon,
  Functions as FunctionsIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import SQLEditor from './SQLEditor';
import ResultsPanel from './ResultsPanel';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Basics' | 'Joins' | 'Aggregation' | 'Subqueries' | 'Window Functions' | 'CTEs';
  icon: React.ReactNode;
  problem: string;
  expectedResult: string;
  hint?: string;
  solution?: string;
}

const challenges: Challenge[] = [
  {
    id: 'basic-select-challenge',
    title: 'Basic SELECT Challenge',
    description: 'Retrieve specific columns from a table with filtering conditions.',
    difficulty: 'Beginner',
    category: 'Basics',
    icon: <TableChartIcon sx={{ fontSize: 40 }} />,
    problem: 'Write a query to get the username and email of users who have saved at least one query.',
    expectedResult: 'SELECT DISTINCT u.username, u.email FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id;',
    hint: 'You\'ll need to use a JOIN to connect users with their saved queries.',
  },
  {
    id: 'where-clause-challenge',
    title: 'WHERE Clause Challenge',
    description: 'Master the art of filtering data with WHERE clauses.',
    difficulty: 'Beginner',
    category: 'Basics',
    icon: <TableChartIcon sx={{ fontSize: 40 }} />,
    problem: 'Find all users who registered in the last 30 days and have an email ending with "@example.com".',
    expectedResult: 'SELECT username, email, created_at FROM users WHERE email LIKE "%@example.com" AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY);',
    hint: 'Use DATE_SUB and CURRENT_DATE functions for date comparison.',
  },
  {
    id: 'join-challenge',
    title: 'Complex JOIN Challenge',
    description: 'Combine data from multiple tables with specific conditions.',
    difficulty: 'Intermediate',
    category: 'Joins',
    icon: <DataObjectIcon sx={{ fontSize: 40 }} />,
    problem: 'Find users who have saved queries with titles containing "report" and have more than 2 saved queries.',
    expectedResult: 'SELECT u.username, COUNT(sq.id) as query_count FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id WHERE sq.title LIKE "%report%" GROUP BY u.id HAVING COUNT(sq.id) > 2;',
    hint: 'You\'ll need to use GROUP BY and HAVING clauses along with the JOIN.',
  },
  {
    id: 'self-join-challenge',
    title: 'Self-Join Challenge',
    description: 'Learn to join a table with itself to find related records.',
    difficulty: 'Intermediate',
    category: 'Joins',
    icon: <DataObjectIcon sx={{ fontSize: 40 }} />,
    problem: 'Find pairs of users who have saved the same query title.',
    expectedResult: 'SELECT DISTINCT u1.username as user1, u2.username as user2, sq1.title FROM users u1 INNER JOIN saved_queries sq1 ON u1.id = sq1.user_id INNER JOIN saved_queries sq2 ON sq1.title = sq2.title INNER JOIN users u2 ON u2.id = sq2.user_id WHERE u1.id < u2.id;',
    hint: 'Use a self-join on the saved_queries table and ensure you don\'t get duplicate pairs.',
  },
  {
    id: 'aggregation-challenge',
    title: 'Aggregation Challenge',
    description: 'Use aggregate functions to summarize data.',
    difficulty: 'Intermediate',
    category: 'Aggregation',
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    problem: 'Find the average number of saved queries per user, and list users who have saved more queries than average.',
    expectedResult: 'WITH avg_queries AS (SELECT AVG(query_count) as avg_count FROM (SELECT COUNT(*) as query_count FROM saved_queries GROUP BY user_id) counts) SELECT u.username, COUNT(sq.id) as query_count FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id GROUP BY u.id, u.username HAVING COUNT(sq.id) > (SELECT avg_count FROM avg_queries);',
    hint: 'Use a subquery to calculate the average first.',
  },
  {
    id: 'subquery-challenge',
    title: 'Subquery Challenge',
    description: 'Master the use of subqueries in SQL.',
    difficulty: 'Intermediate',
    category: 'Subqueries',
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    problem: 'Find users who have saved more queries than the user with the most saved queries in the "report" category.',
    expectedResult: 'SELECT u.username, COUNT(sq.id) as total_queries FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id GROUP BY u.id, u.username HAVING COUNT(sq.id) > (SELECT COUNT(*) FROM saved_queries WHERE title LIKE "%report%" GROUP BY user_id ORDER BY COUNT(*) DESC LIMIT 1);',
    hint: 'Use a subquery to find the maximum count of "report" queries first.',
  },
  {
    id: 'window-function-challenge',
    title: 'Window Functions Challenge',
    description: 'Use window functions to analyze data across rows.',
    difficulty: 'Advanced',
    category: 'Window Functions',
    icon: <FunctionsIcon sx={{ fontSize: 40 }} />,
    problem: 'For each user, find their most recent saved query and rank their queries by creation date.',
    expectedResult: 'SELECT u.username, sq.title, sq.created_at, RANK() OVER (PARTITION BY u.id ORDER BY sq.created_at DESC) as query_rank FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id;',
    hint: 'Use RANK() with PARTITION BY to rank queries within each user.',
  },
  {
    id: 'window-aggregation-challenge',
    title: 'Window Aggregation Challenge',
    description: 'Combine window functions with aggregations.',
    difficulty: 'Advanced',
    category: 'Window Functions',
    icon: <FunctionsIcon sx={{ fontSize: 40 }} />,
    problem: 'For each user, calculate the running total of their saved queries and the percentage of their queries compared to all queries.',
    expectedResult: 'SELECT u.username, sq.title, sq.created_at, COUNT(*) OVER (PARTITION BY u.id ORDER BY sq.created_at) as running_total, COUNT(*) OVER (PARTITION BY u.id) * 100.0 / COUNT(*) OVER () as percentage FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id;',
    hint: 'Use COUNT() with different window specifications for running total and percentage.',
  },
  {
    id: 'cte-challenge',
    title: 'CTE Challenge',
    description: 'Use Common Table Expressions to simplify complex queries.',
    difficulty: 'Advanced',
    category: 'CTEs',
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    problem: 'Find users who have saved more queries than the average number of queries per user.',
    expectedResult: 'WITH user_query_counts AS (SELECT user_id, COUNT(*) as query_count FROM saved_queries GROUP BY user_id) SELECT u.username, uqc.query_count FROM users u INNER JOIN user_query_counts uqc ON u.id = uqc.user_id WHERE uqc.query_count > (SELECT AVG(query_count) FROM user_query_counts);',
    hint: 'Create a CTE to calculate the query count per user first.',
  },
  {
    id: 'recursive-cte-challenge',
    title: 'Recursive CTE Challenge',
    description: 'Use recursive CTEs to handle hierarchical data.',
    difficulty: 'Advanced',
    category: 'CTEs',
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    problem: 'Find all users who are connected through shared query titles (users who have saved the same query as another user, who has saved the same query as another user, and so on).',
    expectedResult: 'WITH RECURSIVE connected_users AS (SELECT DISTINCT u1.id as user1_id, u2.id as user2_id FROM users u1 INNER JOIN saved_queries sq1 ON u1.id = sq1.user_id INNER JOIN saved_queries sq2 ON sq1.title = sq2.title INNER JOIN users u2 ON u2.id = sq2.user_id WHERE u1.id < u2.id UNION SELECT cu.user1_id, u.id FROM connected_users cu INNER JOIN saved_queries sq1 ON cu.user2_id = sq1.user_id INNER JOIN saved_queries sq2 ON sq1.title = sq2.title INNER JOIN users u ON u.id = sq2.user_id WHERE u.id NOT IN (SELECT user2_id FROM connected_users WHERE user1_id = cu.user1_id)) SELECT DISTINCT u1.username as user1, u2.username as user2 FROM connected_users cu INNER JOIN users u1 ON cu.user1_id = u1.id INNER JOIN users u2 ON cu.user2_id = u2.id;',
    hint: 'Use a recursive CTE to find all connected users through shared queries.',
  },
];

const Challenges: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCurrentQuery('');
    setQueryResult(null);
    setShowSolution(false);
  };

  const handleExecuteQuery = async () => {
    setIsLoading(true);
    try {
      // Here you would typically call your API to execute the query
      // For now, we'll simulate a successful query with sample data
      setQueryResult({
        success: true,
        results: [
          { username: 'john_doe', email: 'john@example.com', query_count: 3 },
          { username: 'jane_smith', email: 'jane@example.com', query_count: 2 },
        ],
      });
    } catch (err) {
      // Handle errors appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        SQL Challenges
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Test your SQL skills with these progressively challenging exercises
      </Typography>

      {!selectedChallenge ? (
        <Grid container spacing={3}>
          {challenges.map((challenge) => (
            <Grid item xs={12} sm={6} md={4} key={challenge.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {challenge.icon}
                    <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                      {challenge.title}
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" paragraph>
                    {challenge.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={challenge.difficulty}
                      color={
                        challenge.difficulty === 'Beginner' ? 'success' :
                        challenge.difficulty === 'Intermediate' ? 'warning' :
                        'error'
                      }
                      size="small"
                    />
                    <Chip
                      label={challenge.category}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleChallengeSelect(challenge)}
                  >
                    Start Challenge
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {selectedChallenge.title}
            </Typography>
            <Button onClick={() => setSelectedChallenge(null)}>
              Back to Challenges
            </Button>
          </Box>

          <Typography variant="body1" paragraph>
            {selectedChallenge.problem}
          </Typography>

          {selectedChallenge.hint && (
            <Typography variant="body2" color="text.secondary" paragraph>
              Hint: {selectedChallenge.hint}
            </Typography>
          )}

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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowSolution(!showSolution)}
              sx={{ mr: 2 }}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Button>
          </Box>

          {showSolution && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Solution
              </Typography>
              <Box sx={{ mb: 3, height: '200px' }}>
                <SQLEditor
                  value={selectedChallenge.expectedResult}
                  onChange={() => {}}
                  isLoading={false}
                  onExecuteQuery={() => {}}
                  readOnly
                />
              </Box>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Challenges; 