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
  TableRows as TableRowsIcon,
  AccessTime as AccessTimeIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  ViewQuilt as ViewQuiltIcon,
  Sync as SyncIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import SQLEditor from './SQLEditor';
import ResultsPanel from './ResultsPanel';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Basics' | 'Joins' | 'Aggregation' | 'Subqueries' | 'Window Functions' | 'CTEs' | 'Functions' | 'Optimization' | 'Security';
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
  {
    id: 'pivot-challenge',
    title: 'Pivot Table Challenge',
    description: 'Transform rows into columns using conditional aggregation.',
    difficulty: 'Advanced',
    category: 'Aggregation',
    icon: <TableRowsIcon sx={{ fontSize: 40 }} />,
    problem: 'Create a pivot table showing the count of saved queries by user and difficulty level.',
    expectedResult: 'SELECT u.username, COUNT(CASE WHEN sq.difficulty = \'Beginner\' THEN 1 END) as beginner_queries, COUNT(CASE WHEN sq.difficulty = \'Intermediate\' THEN 1 END) as intermediate_queries, COUNT(CASE WHEN sq.difficulty = \'Advanced\' THEN 1 END) as advanced_queries FROM users u LEFT JOIN saved_queries sq ON u.id = sq.user_id GROUP BY u.id, u.username;',
    hint: 'Use CASE statements within COUNT to create columns for each difficulty level.',
  },
  {
    id: 'temporal-challenge',
    title: 'Temporal Data Challenge',
    description: 'Work with time-series data and date functions.',
    difficulty: 'Intermediate',
    category: 'Functions',
    icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    problem: 'Find users who have been active for at least 3 consecutive days.',
    expectedResult: 'WITH daily_activity AS (SELECT u.id, u.username, DATE(sq.created_at) as activity_date FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id GROUP BY u.id, u.username, DATE(sq.created_at)) SELECT DISTINCT da1.username FROM daily_activity da1 INNER JOIN daily_activity da2 ON da1.id = da2.id AND da2.activity_date = DATE_ADD(da1.activity_date, INTERVAL 1 DAY) INNER JOIN daily_activity da3 ON da1.id = da3.id AND da3.activity_date = DATE_ADD(da1.activity_date, INTERVAL 2 DAY);',
    hint: 'Use self-joins with DATE_ADD to find consecutive days of activity.',
  },
  {
    id: 'performance-challenge',
    title: 'Query Performance Challenge',
    description: 'Optimize a complex query for better performance.',
    difficulty: 'Advanced',
    category: 'Optimization',
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    problem: 'Rewrite the following query to improve its performance: SELECT u.username, COUNT(sq.id) as query_count FROM users u LEFT JOIN saved_queries sq ON u.id = sq.user_id WHERE sq.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) GROUP BY u.id, u.username HAVING COUNT(sq.id) > 5;',
    expectedResult: 'WITH recent_queries AS (SELECT user_id, COUNT(*) as query_count FROM saved_queries WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) GROUP BY user_id HAVING COUNT(*) > 5) SELECT u.username, rq.query_count FROM users u INNER JOIN recent_queries rq ON u.id = rq.user_id;',
    hint: 'Use a CTE to filter and aggregate the data before joining with users.',
  },
  {
    id: 'security-challenge',
    title: 'Security Challenge',
    description: 'Implement row-level security using views and functions.',
    difficulty: 'Advanced',
    category: 'Security',
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    problem: 'Create a view that only shows users their own saved queries and the public queries of others.',
    expectedResult: 'CREATE VIEW user_queries AS SELECT sq.* FROM saved_queries sq WHERE sq.user_id = CURRENT_USER() OR sq.is_public = 1;',
    hint: 'Use CURRENT_USER() function to identify the current user and implement row-level filtering.',
  },
  {
    id: 'json-challenge',
    title: 'JSON Data Challenge',
    description: 'Work with JSON data in SQL queries.',
    difficulty: 'Intermediate',
    category: 'Functions',
    icon: <DataObjectIcon sx={{ fontSize: 40 }} />,
    problem: 'Extract and aggregate data from a JSON column containing query metadata.',
    expectedResult: 'SELECT u.username, COUNT(*) as total_queries, SUM(JSON_EXTRACT(sq.metadata, \'$.execution_time\')) as total_execution_time, AVG(JSON_EXTRACT(sq.metadata, \'$.complexity\')) as avg_complexity FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id WHERE JSON_EXTRACT(sq.metadata, \'$.status\') = \'success\' GROUP BY u.id, u.username;',
    hint: 'Use JSON_EXTRACT to access specific fields within the JSON data.',
  },
  {
    id: 'full-text-challenge',
    title: 'Full-Text Search Challenge',
    description: 'Implement efficient text search in queries.',
    difficulty: 'Intermediate',
    category: 'Functions',
    icon: <SearchIcon sx={{ fontSize: 40 }} />,
    problem: 'Find queries containing specific technical terms using full-text search.',
    expectedResult: 'SELECT u.username, sq.title, MATCH(sq.query) AGAINST(\'JOIN GROUP BY HAVING\' IN BOOLEAN MODE) as relevance FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id WHERE MATCH(sq.query) AGAINST(\'JOIN GROUP BY HAVING\' IN BOOLEAN MODE) ORDER BY relevance DESC;',
    hint: 'Use MATCH AGAINST with BOOLEAN MODE for flexible text search.',
  },
  {
    id: 'partition-challenge',
    title: 'Partitioning Challenge',
    description: 'Optimize queries using table partitioning.',
    difficulty: 'Advanced',
    category: 'Optimization',
    icon: <ViewModuleIcon sx={{ fontSize: 40 }} />,
    problem: 'Create a partitioned table for query history and write a query that efficiently uses the partitions.',
    expectedResult: 'CREATE TABLE query_history (id INT AUTO_INCREMENT, user_id INT, query TEXT, execution_time INT, created_at TIMESTAMP, PRIMARY KEY (id, created_at)) PARTITION BY RANGE (UNIX_TIMESTAMP(created_at)) (PARTITION p0 VALUES LESS THAN (UNIX_TIMESTAMP(\'2023-01-01\')), PARTITION p1 VALUES LESS THAN (UNIX_TIMESTAMP(\'2023-07-01\')), PARTITION p2 VALUES LESS THAN (UNIX_TIMESTAMP(\'2024-01-01\')), PARTITION p3 VALUES LESS THAN MAXVALUE); SELECT COUNT(*) as query_count, AVG(execution_time) as avg_time FROM query_history PARTITION (p2) WHERE user_id = 1;',
    hint: 'Use RANGE partitioning based on timestamp and query specific partitions.',
  },
  {
    id: 'materialized-view-challenge',
    title: 'Materialized View Challenge',
    description: 'Create and use materialized views for performance.',
    difficulty: 'Advanced',
    category: 'Optimization',
    icon: <ViewQuiltIcon sx={{ fontSize: 40 }} />,
    problem: 'Create a materialized view for frequently accessed query statistics.',
    expectedResult: 'CREATE MATERIALIZED VIEW query_stats AS SELECT u.username, COUNT(sq.id) as total_queries, AVG(sq.execution_time) as avg_time, MAX(sq.created_at) as last_query FROM users u LEFT JOIN saved_queries sq ON u.id = sq.user_id GROUP BY u.id, u.username WITH DATA; REFRESH MATERIALIZED VIEW query_stats; SELECT * FROM query_stats WHERE total_queries > 10 ORDER BY avg_time DESC;',
    hint: 'Use materialized views to pre-compute and store aggregated data.',
  },
  {
    id: 'replication-challenge',
    title: 'Replication Challenge',
    description: 'Handle read-write operations in a replicated environment.',
    difficulty: 'Advanced',
    category: 'Optimization',
    icon: <SyncIcon sx={{ fontSize: 40 }} />,
    problem: 'Write queries that efficiently handle read-write operations in a master-slave replication setup.',
    expectedResult: '-- Write operations (master) INSERT INTO saved_queries (user_id, title, query) VALUES (1, \'New Query\', \'SELECT * FROM users\'); -- Read operations (slave) SELECT u.username, COUNT(sq.id) as query_count FROM users u LEFT JOIN saved_queries sq ON u.id = sq.user_id GROUP BY u.id, u.username;',
    hint: 'Separate read and write operations to different database instances.',
  },
  {
    id: 'backup-challenge',
    title: 'Backup and Recovery Challenge',
    description: 'Implement point-in-time recovery strategy.',
    difficulty: 'Advanced',
    category: 'Security',
    icon: <BackupIcon sx={{ fontSize: 40 }} />,
    problem: 'Create a backup strategy and write queries to restore data to a specific point in time.',
    expectedResult: '-- Backup creation mysqldump --single-transaction --master-data=2 --databases sql_playground > backup.sql -- Point-in-time recovery mysqlbinlog --start-datetime="2023-01-01 00:00:00" --stop-datetime="2023-01-02 00:00:00" mysql-bin.000001 | mysql -u root -p',
    hint: 'Use binary logging and transaction consistency for point-in-time recovery.',
  },
  {
    id: 'advanced-json-challenge',
    title: 'Advanced JSON Manipulation',
    description: 'Work with complex JSON data structures and nested queries.',
    difficulty: 'Advanced',
    category: 'Functions',
    icon: <DataObjectIcon sx={{ fontSize: 40 }} />,
    problem: 'Given a table with JSON data containing user preferences and activity logs, find users who have changed their notification settings more than 3 times in the last month and have specific activity patterns.',
    expectedResult: `WITH user_preferences AS (
  SELECT 
    user_id,
    JSON_EXTRACT(preferences, '$.notifications') as notification_settings,
    created_at
  FROM user_settings
  WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
),
notification_changes AS (
  SELECT 
    user_id,
    COUNT(*) as change_count
  FROM user_preferences
  GROUP BY user_id
  HAVING COUNT(*) > 3
),
user_activity AS (
  SELECT 
    user_id,
    JSON_EXTRACT(activity_log, '$.type') as activity_type,
    COUNT(*) as activity_count
  FROM user_activities
  WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
  GROUP BY user_id, JSON_EXTRACT(activity_log, '$.type')
)
SELECT 
  u.username,
  nc.change_count as notification_changes,
  GROUP_CONCAT(CONCAT(ua.activity_type, ':', ua.activity_count)) as activity_pattern
FROM users u
JOIN notification_changes nc ON u.id = nc.user_id
JOIN user_activity ua ON u.id = ua.user_id
GROUP BY u.id, u.username, nc.change_count
HAVING COUNT(DISTINCT ua.activity_type) >= 3;`,
    hint: 'Use JSON_EXTRACT to access nested JSON data and combine it with window functions for pattern analysis.'
  },
  {
    id: 'recursive-hierarchy-challenge',
    title: 'Recursive Hierarchy Analysis',
    description: 'Analyze multi-level organizational hierarchies using recursive CTEs.',
    difficulty: 'Advanced',
    category: 'CTEs',
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    problem: 'Given an organizational structure with employees and their managers, find all employees who are at least 3 levels deep in the hierarchy and have more subordinates than their manager.',
    expectedResult: `WITH RECURSIVE org_hierarchy AS (
  -- Base case: Get all employees
  SELECT 
    id,
    name,
    manager_id,
    1 as level,
    CAST(name AS CHAR(1000)) as path
  FROM employees
  WHERE manager_id IS NULL
  
  UNION ALL
  
  -- Recursive case: Get subordinates
  SELECT 
    e.id,
    e.name,
    e.manager_id,
    oh.level + 1,
    CONCAT(oh.path, ' > ', e.name)
  FROM employees e
  JOIN org_hierarchy oh ON e.manager_id = oh.id
),
subordinate_counts AS (
  SELECT 
    manager_id,
    COUNT(*) as subordinate_count
  FROM employees
  GROUP BY manager_id
)
SELECT 
  oh.id,
  oh.name,
  oh.level,
  oh.path,
  sc.subordinate_count,
  msc.subordinate_count as manager_subordinate_count
FROM org_hierarchy oh
JOIN subordinate_counts sc ON oh.id = sc.manager_id
JOIN employees e ON oh.manager_id = e.id
JOIN subordinate_counts msc ON e.id = msc.manager_id
WHERE oh.level >= 3
AND sc.subordinate_count > msc.subordinate_count
ORDER BY oh.level DESC, sc.subordinate_count DESC;`,
    hint: 'Use a recursive CTE to build the hierarchy and calculate subordinate counts at each level.'
  },
  {
    id: 'temporal-analysis-challenge',
    title: 'Temporal Data Analysis',
    description: 'Analyze time-series data with complex temporal patterns.',
    difficulty: 'Advanced',
    category: 'Functions',
    icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    problem: 'Find users who have shown a specific pattern of activity: at least 3 consecutive days of increasing activity, followed by a day of decreased activity, and then a return to the previous level.',
    expectedResult: `WITH daily_activity AS (
  SELECT 
    user_id,
    DATE(activity_time) as activity_date,
    COUNT(*) as activity_count
  FROM user_activities
  GROUP BY user_id, DATE(activity_time)
),
activity_patterns AS (
  SELECT 
    user_id,
    activity_date,
    activity_count,
    LAG(activity_count, 1) OVER (PARTITION BY user_id ORDER BY activity_date) as prev_count,
    LAG(activity_count, 2) OVER (PARTITION BY user_id ORDER BY activity_date) as prev_prev_count,
    LAG(activity_count, 3) OVER (PARTITION BY user_id ORDER BY activity_date) as prev_prev_prev_count,
    LEAD(activity_count, 1) OVER (PARTITION BY user_id ORDER BY activity_date) as next_count
  FROM daily_activity
)
SELECT DISTINCT
  u.username,
  ap.activity_date as pattern_date,
  ap.activity_count,
  ap.prev_count,
  ap.prev_prev_count,
  ap.prev_prev_prev_count,
  ap.next_count
FROM activity_patterns ap
JOIN users u ON ap.user_id = u.id
WHERE 
  -- Three consecutive days of increasing activity
  ap.prev_prev_prev_count < ap.prev_prev_count 
  AND ap.prev_prev_count < ap.prev_count
  AND ap.prev_count < ap.activity_count
  -- Followed by a decrease
  AND ap.activity_count > ap.next_count
  -- And then a return to previous level
  AND ap.next_count >= ap.prev_count;`,
    hint: 'Use window functions to compare activity levels across consecutive days.'
  },
  {
    id: 'advanced-window-challenge',
    title: 'Advanced Window Functions',
    description: 'Master complex window function patterns and analytics.',
    difficulty: 'Advanced',
    category: 'Window Functions',
    icon: <FunctionsIcon sx={{ fontSize: 40 }} />,
    problem: 'For each user, calculate their activity percentile within their user group, and find users who are consistently in the top 10% of activity for at least 3 consecutive months.',
    expectedResult: `WITH monthly_activity AS (
  SELECT 
    user_id,
    DATE_FORMAT(activity_date, '%Y-%m') as month,
    COUNT(*) as activity_count
  FROM user_activities
  GROUP BY user_id, DATE_FORMAT(activity_date, '%Y-%m')
),
activity_percentiles AS (
  SELECT 
    user_id,
    month,
    activity_count,
    PERCENT_RANK() OVER (
      PARTITION BY month 
      ORDER BY activity_count
    ) * 100 as percentile
  FROM monthly_activity
),
consecutive_months AS (
  SELECT 
    user_id,
    month,
    percentile,
    LAG(month, 1) OVER (PARTITION BY user_id ORDER BY month) as prev_month,
    LAG(month, 2) OVER (PARTITION BY user_id ORDER BY month) as prev_prev_month
  FROM activity_percentiles
  WHERE percentile >= 90
)
SELECT DISTINCT
  u.username,
  cm.month,
  cm.percentile,
  ma.activity_count
FROM consecutive_months cm
JOIN users u ON cm.user_id = u.id
JOIN monthly_activity ma ON cm.user_id = ma.user_id AND cm.month = ma.month
WHERE 
  cm.prev_month IS NOT NULL 
  AND cm.prev_prev_month IS NOT NULL
  AND DATEDIFF(
    STR_TO_DATE(CONCAT(cm.month, '-01'), '%Y-%m-%d'),
    STR_TO_DATE(CONCAT(cm.prev_month, '-01'), '%Y-%m-%d')
  ) = 30
  AND DATEDIFF(
    STR_TO_DATE(CONCAT(cm.prev_month, '-01'), '%Y-%m-%d'),
    STR_TO_DATE(CONCAT(cm.prev_prev_month, '-01'), '%Y-%m-%d')
  ) = 30
ORDER BY cm.month DESC, cm.percentile DESC;`,
    hint: 'Use PERCENT_RANK() for percentile calculation and window functions to check consecutive months.'
  },
  {
    id: 'optimization-challenge',
    title: 'Query Optimization Challenge',
    description: 'Optimize a complex query for better performance.',
    difficulty: 'Advanced',
    category: 'Optimization',
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    problem: 'Given a slow-running query that joins multiple large tables with complex conditions, optimize it for better performance while maintaining the same results.',
    expectedResult: `-- Original slow query
SELECT 
  u.username,
  COUNT(DISTINCT sq.id) as query_count,
  AVG(qh.execution_time) as avg_execution_time,
  MAX(qh.created_at) as last_query_time
FROM users u
LEFT JOIN saved_queries sq ON u.id = sq.user_id
LEFT JOIN query_history qh ON sq.id = qh.query_id
WHERE qh.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP BY u.id, u.username
HAVING COUNT(DISTINCT sq.id) > 5;

-- Optimized query
WITH recent_queries AS (
  SELECT 
    query_id,
    execution_time,
    created_at
  FROM query_history
  WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
),
user_query_stats AS (
  SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT sq.id) as query_count,
    AVG(rq.execution_time) as avg_execution_time,
    MAX(rq.created_at) as last_query_time
  FROM users u
  INNER JOIN saved_queries sq ON u.id = sq.user_id
  INNER JOIN recent_queries rq ON sq.id = rq.query_id
  GROUP BY u.id, u.username
  HAVING COUNT(DISTINCT sq.id) > 5
)
SELECT * FROM user_query_stats
ORDER BY query_count DESC, avg_execution_time ASC;`,
    hint: 'Use CTEs to break down the query into smaller, more efficient parts and optimize join conditions.'
  }
];

const Challenges: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCurrentQuery('');
    setQueryResult(null);
    setShowSolution(false);
    setIncorrectAttempts(0);
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

      // Check if the query matches the expected result
      if (currentQuery.trim().toLowerCase() !== selectedChallenge?.expectedResult.trim().toLowerCase()) {
        setIncorrectAttempts(prev => prev + 1);
      }
    } catch (err) {
      // Handle errors appropriately
      setIncorrectAttempts(prev => prev + 1);
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
              disabled={incorrectAttempts < 3}
              sx={{ mr: 2 }}
            >
              {showSolution ? 'Hide Solution' : `Show Solution (${3 - incorrectAttempts} attempts remaining)`}
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