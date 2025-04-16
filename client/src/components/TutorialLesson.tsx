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
  'debugging': [
    {
      id: 'syntax-errors',
      title: 'Syntax Error Detection',
      content: 'Learn how to identify and fix common SQL syntax errors. Syntax errors occur when the SQL statement doesn\'t follow the correct structure or format.',
      exampleQuery: 'SELECT username, email FROM users WHERE id = 1;',
      exerciseQuery: 'SELECT username email FROM users WHERE id = 1;', // Intentionally incorrect
      expectedResult: 'SELECT username, email FROM users WHERE id = 1;',
      hint: 'Look for missing commas between column names in the SELECT statement.',
    },
    {
      id: 'logical-errors',
      title: 'Logical Error Detection',
      content: 'Learn how to identify logical errors in SQL queries. Logical errors occur when the query runs without syntax errors but produces incorrect results.',
      exampleQuery: 'SELECT COUNT(*) FROM users WHERE email LIKE "%@example.com";',
      exerciseQuery: 'SELECT COUNT(*) FROM users WHERE email = "@example.com";', // Intentionally incorrect
      expectedResult: 'SELECT COUNT(*) FROM users WHERE email LIKE "%@example.com";',
      hint: 'Check if you\'re using the correct comparison operator for pattern matching.',
    },
    {
      id: 'performance-issues',
      title: 'Performance Issues',
      content: 'Learn how to identify and fix performance issues in SQL queries. Common issues include missing indexes, inefficient joins, and suboptimal query structure.',
      exampleQuery: 'SELECT u.username, q.title FROM users u INNER JOIN saved_queries q ON u.id = q.user_id WHERE u.id = 1;',
      exerciseQuery: 'SELECT u.username, q.title FROM users u, saved_queries q WHERE u.id = q.user_id AND u.id = 1;', // Intentionally inefficient
      expectedResult: 'SELECT u.username, q.title FROM users u INNER JOIN saved_queries q ON u.id = q.user_id WHERE u.id = 1;',
      hint: 'Consider using explicit JOIN syntax instead of implicit joins for better readability and performance.',
    },
    {
      id: 'null-handling',
      title: 'NULL Value Handling',
      content: 'Learn how to properly handle NULL values in SQL queries. NULL values can cause unexpected results if not handled correctly.',
      exampleQuery: 'SELECT username FROM users WHERE email IS NOT NULL;',
      exerciseQuery: 'SELECT username FROM users WHERE email != NULL;', // Intentionally incorrect
      expectedResult: 'SELECT username FROM users WHERE email IS NOT NULL;',
      hint: 'Remember that NULL values require special comparison operators (IS NULL, IS NOT NULL).',
    },
  ],
  'window-functions': [
    {
      id: 'window-basics',
      title: 'Window Functions Basics',
      content: 'Window functions perform calculations across a set of rows related to the current row. Unlike regular aggregate functions, window functions do not group rows into a single output row.',
      exampleQuery: 'SELECT username, COUNT(*) OVER (PARTITION BY user_id) as query_count FROM saved_queries;',
      exerciseQuery: 'SELECT username, RANK() OVER (ORDER BY created_at DESC) as rank FROM saved_queries;',
      expectedResult: 'SELECT username, RANK() OVER (ORDER BY created_at DESC) as rank FROM saved_queries;',
      hint: 'Use RANK() with OVER clause to assign ranks to rows based on creation date.',
    },
    {
      id: 'window-aggregation',
      title: 'Window Aggregation',
      content: 'Window functions can be used with aggregate functions to calculate running totals, moving averages, and other cumulative calculations.',
      exampleQuery: 'SELECT username, created_at, SUM(execution_time) OVER (PARTITION BY user_id ORDER BY created_at) as running_total FROM saved_queries;',
      exerciseQuery: 'SELECT username, created_at, AVG(execution_time) OVER (PARTITION BY user_id ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) as moving_avg FROM saved_queries;',
      expectedResult: 'SELECT username, created_at, AVG(execution_time) OVER (PARTITION BY user_id ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) as moving_avg FROM saved_queries;',
      hint: 'Use ROWS BETWEEN to define the window frame for the moving average calculation.',
    }
  ],
  'ctes': [
    {
      id: 'cte-basics',
      title: 'Common Table Expressions Basics',
      content: 'CTEs provide a way to create temporary result sets that can be referenced within a SELECT, INSERT, UPDATE, or DELETE statement.',
      exampleQuery: 'WITH user_queries AS (SELECT user_id, COUNT(*) as query_count FROM saved_queries GROUP BY user_id) SELECT u.username, uq.query_count FROM users u INNER JOIN user_queries uq ON u.id = uq.user_id;',
      exerciseQuery: 'WITH recent_queries AS (SELECT * FROM saved_queries WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) SELECT username, COUNT(*) as recent_count FROM users u INNER JOIN recent_queries rq ON u.id = rq.user_id GROUP BY u.id, u.username;',
      expectedResult: 'WITH recent_queries AS (SELECT * FROM saved_queries WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)) SELECT username, COUNT(*) as recent_count FROM users u INNER JOIN recent_queries rq ON u.id = rq.user_id GROUP BY u.id, u.username;',
      hint: 'Use CTEs to break down complex queries into more manageable parts.',
    },
    {
      id: 'recursive-cte',
      title: 'Recursive CTEs',
      content: 'Recursive CTEs allow you to work with hierarchical data by repeatedly executing a query that references itself.',
      exampleQuery: 'WITH RECURSIVE query_tree AS (SELECT id, title, parent_id, 1 as level FROM saved_queries WHERE parent_id IS NULL UNION ALL SELECT sq.id, sq.title, sq.parent_id, qt.level + 1 FROM saved_queries sq INNER JOIN query_tree qt ON sq.parent_id = qt.id) SELECT * FROM query_tree ORDER BY level, id;',
      exerciseQuery: 'WITH RECURSIVE user_network AS (SELECT user_id, 1 as level FROM saved_queries WHERE title LIKE "%shared%" UNION ALL SELECT sq.user_id, un.level + 1 FROM saved_queries sq INNER JOIN user_network un ON sq.title = (SELECT title FROM saved_queries WHERE user_id = un.user_id LIMIT 1)) SELECT DISTINCT u.username, MIN(un.level) as connection_level FROM users u INNER JOIN user_network un ON u.id = un.user_id GROUP BY u.id, u.username ORDER BY connection_level;',
      expectedResult: 'WITH RECURSIVE user_network AS (SELECT user_id, 1 as level FROM saved_queries WHERE title LIKE "%shared%" UNION ALL SELECT sq.user_id, un.level + 1 FROM saved_queries sq INNER JOIN user_network un ON sq.title = (SELECT title FROM saved_queries WHERE user_id = un.user_id LIMIT 1)) SELECT DISTINCT u.username, MIN(un.level) as connection_level FROM users u INNER JOIN user_network un ON u.id = un.user_id GROUP BY u.id, u.username ORDER BY connection_level;',
      hint: 'Use UNION ALL in recursive CTEs to build the result set incrementally.',
    }
  ],
  'indexes': [
    {
      id: 'index-basics',
      title: 'Index Basics',
      content: 'Indexes are used to speed up data retrieval operations. They work like a book index, allowing the database to find data without scanning the entire table.',
      exampleQuery: 'CREATE INDEX idx_username ON users(username); CREATE INDEX idx_query_title ON saved_queries(title);',
      exerciseQuery: 'CREATE INDEX idx_user_queries ON saved_queries(user_id, created_at);',
      expectedResult: 'CREATE INDEX idx_user_queries ON saved_queries(user_id, created_at);',
      hint: 'Create a composite index on frequently queried columns.',
    },
    {
      id: 'index-usage',
      title: 'Index Usage and Optimization',
      content: 'Learn how to analyze index usage and optimize queries to take advantage of indexes.',
      exampleQuery: 'EXPLAIN SELECT username FROM users WHERE username LIKE "john%";',
      exerciseQuery: 'EXPLAIN SELECT u.username, COUNT(sq.id) FROM users u LEFT JOIN saved_queries sq ON u.id = sq.user_id WHERE u.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) GROUP BY u.id, u.username;',
      expectedResult: 'EXPLAIN SELECT u.username, COUNT(sq.id) FROM users u LEFT JOIN saved_queries sq ON u.id = sq.user_id WHERE u.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) GROUP BY u.id, u.username;',
      hint: 'Use EXPLAIN to analyze query execution plans and identify missing indexes.',
    }
  ],
  'transactions': [
    {
      id: 'transaction-basics',
      title: 'Transaction Basics',
      content: 'Transactions ensure data integrity by grouping multiple operations into a single atomic unit.',
      exampleQuery: 'START TRANSACTION; INSERT INTO users (username, email) VALUES ("new_user", "new@example.com"); INSERT INTO saved_queries (user_id, title, query) VALUES (LAST_INSERT_ID(), "First Query", "SELECT * FROM users"); COMMIT;',
      exerciseQuery: 'START TRANSACTION; UPDATE users SET email = "updated@example.com" WHERE username = "john_doe"; INSERT INTO saved_queries (user_id, title, query) VALUES ((SELECT id FROM users WHERE username = "john_doe"), "Update Query", "UPDATE users SET email = \'updated@example.com\' WHERE username = \'john_doe\'"); COMMIT;',
      expectedResult: 'START TRANSACTION; UPDATE users SET email = "updated@example.com" WHERE username = "john_doe"; INSERT INTO saved_queries (user_id, title, query) VALUES ((SELECT id FROM users WHERE username = "john_doe"), "Update Query", "UPDATE users SET email = \'updated@example.com\' WHERE username = \'john_doe\'"); COMMIT;',
      hint: 'Use transactions to ensure both the user update and query insertion succeed or fail together.',
    },
    {
      id: 'isolation-levels',
      title: 'Transaction Isolation Levels',
      content: 'Isolation levels control how transactions interact with each other and prevent various types of concurrency issues.',
      exampleQuery: 'SET TRANSACTION ISOLATION LEVEL READ COMMITTED; START TRANSACTION; SELECT * FROM users WHERE id = 1; COMMIT;',
      exerciseQuery: 'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; START TRANSACTION; SELECT COUNT(*) FROM saved_queries WHERE user_id = 1; INSERT INTO saved_queries (user_id, title, query) VALUES (1, "New Query", "SELECT * FROM users"); COMMIT;',
      expectedResult: 'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; START TRANSACTION; SELECT COUNT(*) FROM saved_queries WHERE user_id = 1; INSERT INTO saved_queries (user_id, title, query) VALUES (1, "New Query", "SELECT * FROM users"); COMMIT;',
      hint: 'Use SERIALIZABLE isolation level to prevent phantom reads.',
    }
  ],
  'views': [
    {
      id: 'view-basics',
      title: 'View Basics',
      content: 'Views are virtual tables that represent the result of a stored query. They can simplify complex queries and provide an additional layer of security.',
      exampleQuery: 'CREATE VIEW user_query_stats AS SELECT u.username, COUNT(sq.id) as query_count, MAX(sq.created_at) as last_query FROM users u LEFT JOIN saved_queries sq ON u.id = sq.user_id GROUP BY u.id, u.username;',
      exerciseQuery: 'CREATE VIEW recent_queries AS SELECT u.username, sq.title, sq.created_at FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id WHERE sq.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY);',
      expectedResult: 'CREATE VIEW recent_queries AS SELECT u.username, sq.title, sq.created_at FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id WHERE sq.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY);',
      hint: 'Create a view to simplify access to recent queries.',
    },
    {
      id: 'view-security',
      title: 'Views for Security',
      content: 'Views can be used to implement row-level security by restricting access to specific columns or rows.',
      exampleQuery: 'CREATE VIEW public_queries AS SELECT username, title FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id WHERE sq.is_public = 1;',
      exerciseQuery: 'CREATE VIEW user_own_queries AS SELECT * FROM saved_queries WHERE user_id = CURRENT_USER();',
      expectedResult: 'CREATE VIEW user_own_queries AS SELECT * FROM saved_queries WHERE user_id = CURRENT_USER();',
      hint: 'Use CURRENT_USER() function to restrict access to user-specific data.',
    }
  ],
  'stored-procedures': [
    {
      id: 'procedure-basics',
      title: 'Stored Procedure Basics',
      content: 'Stored procedures are precompiled SQL statements stored in the database. They can accept parameters and return results.',
      exampleQuery: 'CREATE PROCEDURE get_user_queries(IN user_id INT) BEGIN SELECT title, query, created_at FROM saved_queries WHERE user_id = user_id ORDER BY created_at DESC; END;',
      exerciseQuery: 'CREATE PROCEDURE create_user_query(IN user_id INT, IN title VARCHAR(255), IN query_text TEXT) BEGIN INSERT INTO saved_queries (user_id, title, query) VALUES (user_id, title, query_text); SELECT LAST_INSERT_ID() as query_id; END;',
      expectedResult: 'CREATE PROCEDURE create_user_query(IN user_id INT, IN title VARCHAR(255), IN query_text TEXT) BEGIN INSERT INTO saved_queries (user_id, title, query) VALUES (user_id, title, query_text); SELECT LAST_INSERT_ID() as query_id; END;',
      hint: 'Use parameters to make stored procedures flexible and reusable.',
    },
    {
      id: 'procedure-advanced',
      title: 'Advanced Stored Procedures',
      content: 'Learn to create more complex stored procedures with error handling, transactions, and conditional logic.',
      exampleQuery: 'CREATE PROCEDURE update_user_email(IN user_id INT, IN new_email VARCHAR(255)) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Failed to update email"; END; START TRANSACTION; UPDATE users SET email = new_email WHERE id = user_id; INSERT INTO email_history (user_id, old_email, new_email) VALUES (user_id, (SELECT email FROM users WHERE id = user_id), new_email); COMMIT; END;',
      exerciseQuery: 'CREATE PROCEDURE backup_user_queries(IN user_id INT) BEGIN DECLARE done INT DEFAULT FALSE; DECLARE query_id INT; DECLARE query_title VARCHAR(255); DECLARE query_text TEXT; DECLARE cur CURSOR FOR SELECT id, title, query FROM saved_queries WHERE user_id = user_id; DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE; START TRANSACTION; OPEN cur; read_loop: LOOP FETCH cur INTO query_id, query_title, query_text; IF done THEN LEAVE read_loop; END IF; INSERT INTO query_backups (user_id, query_id, title, query, backed_up_at) VALUES (user_id, query_id, query_title, query_text, NOW()); END LOOP; CLOSE cur; COMMIT; END;',
      expectedResult: 'CREATE PROCEDURE backup_user_queries(IN user_id INT) BEGIN DECLARE done INT DEFAULT FALSE; DECLARE query_id INT; DECLARE query_title VARCHAR(255); DECLARE query_text TEXT; DECLARE cur CURSOR FOR SELECT id, title, query FROM saved_queries WHERE user_id = user_id; DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE; START TRANSACTION; OPEN cur; read_loop: LOOP FETCH cur INTO query_id, query_title, query_text; IF done THEN LEAVE read_loop; END IF; INSERT INTO query_backups (user_id, query_id, title, query, backed_up_at) VALUES (user_id, query_id, query_title, query_text, NOW()); END LOOP; CLOSE cur; COMMIT; END;',
      hint: 'Use cursors to process multiple rows in a stored procedure.',
    }
  ],
  'triggers': [
    {
      id: 'trigger-basics',
      title: 'Trigger Basics',
      content: 'Triggers are automatic procedures that run when specific events occur in the database.',
      exampleQuery: 'CREATE TRIGGER before_query_insert BEFORE INSERT ON saved_queries FOR EACH ROW BEGIN SET NEW.created_at = NOW(); END;',
      exerciseQuery: 'CREATE TRIGGER after_query_update AFTER UPDATE ON saved_queries FOR EACH ROW BEGIN INSERT INTO query_history (query_id, old_title, new_title, changed_at) VALUES (NEW.id, OLD.title, NEW.title, NOW()); END;',
      expectedResult: 'CREATE TRIGGER after_query_update AFTER UPDATE ON saved_queries FOR EACH ROW BEGIN INSERT INTO query_history (query_id, old_title, new_title, changed_at) VALUES (NEW.id, OLD.title, NEW.title, NOW()); END;',
      hint: 'Use OLD and NEW to access the old and new values in a trigger.',
    },
    {
      id: 'trigger-advanced',
      title: 'Advanced Triggers',
      content: 'Learn to create more complex triggers with conditional logic and error handling.',
      exampleQuery: 'CREATE TRIGGER validate_query BEFORE INSERT ON saved_queries FOR EACH ROW BEGIN IF LENGTH(NEW.query) < 10 THEN SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Query too short"; END IF; END;',
      exerciseQuery: 'CREATE TRIGGER maintain_query_count AFTER INSERT ON saved_queries FOR EACH ROW BEGIN UPDATE users SET query_count = (SELECT COUNT(*) FROM saved_queries WHERE user_id = NEW.user_id) WHERE id = NEW.user_id; END;',
      expectedResult: 'CREATE TRIGGER maintain_query_count AFTER INSERT ON saved_queries FOR EACH ROW BEGIN UPDATE users SET query_count = (SELECT COUNT(*) FROM saved_queries WHERE user_id = NEW.user_id) WHERE id = NEW.user_id; END;',
      hint: 'Use triggers to maintain denormalized data for better performance.',
    }
  ],
  'temporal-tables': [
    {
      id: 'temporal-basics',
      title: 'Temporal Tables Basics',
      content: 'Temporal tables automatically track the history of data changes, allowing you to query data as it existed at any point in time.',
      exampleQuery: 'CREATE TABLE users (id INT PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), PERIOD FOR SYSTEM_TIME (valid_from, valid_to)) WITH SYSTEM VERSIONING;',
      exerciseQuery: 'SELECT * FROM users FOR SYSTEM_TIME AS OF "2023-01-01 00:00:00" WHERE username = "john_doe";',
      expectedResult: 'SELECT * FROM users FOR SYSTEM_TIME AS OF "2023-01-01 00:00:00" WHERE username = "john_doe";',
      hint: 'Use FOR SYSTEM_TIME AS OF to query historical data.',
    },
    {
      id: 'temporal-advanced',
      title: 'Advanced Temporal Queries',
      content: 'Learn to perform complex temporal queries, including tracking changes over time and comparing historical states.',
      exampleQuery: 'SELECT u.username, u.email, u.valid_from, u.valid_to FROM users FOR SYSTEM_TIME ALL WHERE username = "john_doe" ORDER BY valid_from;',
      exerciseQuery: 'SELECT u1.username, u1.email as old_email, u2.email as new_email, u1.valid_to as changed_at FROM users FOR SYSTEM_TIME ALL u1 JOIN users FOR SYSTEM_TIME ALL u2 ON u1.id = u2.id AND u1.valid_to = u2.valid_from WHERE u1.email != u2.email;',
      expectedResult: 'SELECT u1.username, u1.email as old_email, u2.email as new_email, u1.valid_to as changed_at FROM users FOR SYSTEM_TIME ALL u1 JOIN users FOR SYSTEM_TIME ALL u2 ON u1.id = u2.id AND u1.valid_to = u2.valid_from WHERE u1.email != u2.email;',
      hint: 'Use FOR SYSTEM_TIME ALL to access all historical versions of the data.',
    }
  ],
  'json-handling': [
    {
      id: 'json-basics',
      title: 'JSON Basics',
      content: 'Learn to store, query, and manipulate JSON data in SQL databases.',
      exampleQuery: 'CREATE TABLE user_settings (user_id INT PRIMARY KEY, settings JSON); INSERT INTO user_settings VALUES (1, \'{"theme": "dark", "notifications": true, "language": "en"}\');',
      exerciseQuery: 'SELECT user_id, JSON_EXTRACT(settings, "$.theme") as theme FROM user_settings WHERE JSON_EXTRACT(settings, "$.notifications") = true;',
      expectedResult: 'SELECT user_id, JSON_EXTRACT(settings, "$.theme") as theme FROM user_settings WHERE JSON_EXTRACT(settings, "$.notifications") = true;',
      hint: 'Use JSON_EXTRACT to access specific values in JSON data.',
    },
    {
      id: 'json-advanced',
      title: 'Advanced JSON Operations',
      content: 'Learn to perform complex JSON operations, including modification and aggregation.',
      exampleQuery: 'UPDATE user_settings SET settings = JSON_SET(settings, "$.theme", "light") WHERE user_id = 1;',
      exerciseQuery: 'SELECT user_id, JSON_ARRAYAGG(JSON_OBJECT("key", jt.key, "value", jt.value)) as settings_array FROM user_settings, JSON_TABLE(settings, "$" COLUMNS (key VARCHAR(255) PATH "$.key", value JSON PATH "$.value")) as jt GROUP BY user_id;',
      expectedResult: 'SELECT user_id, JSON_ARRAYAGG(JSON_OBJECT("key", jt.key, "value", jt.value)) as settings_array FROM user_settings, JSON_TABLE(settings, "$" COLUMNS (key VARCHAR(255) PATH "$.key", value JSON PATH "$.value")) as jt GROUP BY user_id;',
      hint: 'Use JSON_TABLE to convert JSON data into a relational format.',
    }
  ],
  'full-text-search': [
    {
      id: 'fts-basics',
      title: 'Full-Text Search Basics',
      content: 'Learn to implement efficient text search capabilities using full-text indexes.',
      exampleQuery: 'CREATE FULLTEXT INDEX idx_query_text ON saved_queries(query); SELECT id, title, MATCH(query) AGAINST("SELECT * FROM users" IN NATURAL LANGUAGE MODE) as relevance FROM saved_queries WHERE MATCH(query) AGAINST("SELECT * FROM users" IN NATURAL LANGUAGE MODE);',
      exerciseQuery: 'SELECT id, title, MATCH(query) AGAINST("JOIN" IN BOOLEAN MODE) as relevance FROM saved_queries WHERE MATCH(query) AGAINST("+JOIN -INNER" IN BOOLEAN MODE) ORDER BY relevance DESC;',
      expectedResult: 'SELECT id, title, MATCH(query) AGAINST("JOIN" IN BOOLEAN MODE) as relevance FROM saved_queries WHERE MATCH(query) AGAINST("+JOIN -INNER" IN BOOLEAN MODE) ORDER BY relevance DESC;',
      hint: 'Use BOOLEAN MODE for more precise search control.',
    },
    {
      id: 'fts-advanced',
      title: 'Advanced Full-Text Search',
      content: 'Learn to implement more sophisticated text search features, including relevance ranking and query expansion.',
      exampleQuery: 'SELECT id, title, MATCH(query) AGAINST("database optimization" WITH QUERY EXPANSION) as relevance FROM saved_queries WHERE MATCH(query) AGAINST("database optimization" WITH QUERY EXPANSION) ORDER BY relevance DESC LIMIT 10;',
      exerciseQuery: 'SELECT id, title, MATCH(query) AGAINST("SELECT FROM WHERE" IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) as relevance, (SELECT COUNT(*) FROM saved_queries sq2 WHERE MATCH(sq2.query) AGAINST("SELECT FROM WHERE" IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) AND sq2.id <= sq.id) as rank FROM saved_queries sq WHERE MATCH(query) AGAINST("SELECT FROM WHERE" IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) ORDER BY relevance DESC;',
      expectedResult: 'SELECT id, title, MATCH(query) AGAINST("SELECT FROM WHERE" IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) as relevance, (SELECT COUNT(*) FROM saved_queries sq2 WHERE MATCH(sq2.query) AGAINST("SELECT FROM WHERE" IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) AND sq2.id <= sq.id) as rank FROM saved_queries sq WHERE MATCH(query) AGAINST("SELECT FROM WHERE" IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) ORDER BY relevance DESC;',
      hint: 'Use WITH QUERY EXPANSION to find related terms.',
    }
  ],
  'partitioning': [
    {
      id: 'partition-basics',
      title: 'Table Partitioning Basics',
      content: 'Learn to improve query performance and manageability through table partitioning.',
      exampleQuery: 'CREATE TABLE query_logs (id INT, user_id INT, query TEXT, executed_at TIMESTAMP) PARTITION BY RANGE (YEAR(executed_at)) (PARTITION p2023 VALUES LESS THAN (2024), PARTITION p2024 VALUES LESS THAN (2025));',
      exerciseQuery: 'CREATE TABLE query_logs (id INT, user_id INT, query TEXT, executed_at TIMESTAMP) PARTITION BY LIST (user_id) (PARTITION p1 VALUES IN (1), PARTITION p2 VALUES IN (2), PARTITION p3 VALUES IN (3));',
      expectedResult: 'CREATE TABLE query_logs (id INT, user_id INT, query TEXT, executed_at TIMESTAMP) PARTITION BY LIST (user_id) (PARTITION p1 VALUES IN (1), PARTITION p2 VALUES IN (2), PARTITION p3 VALUES IN (3));',
      hint: 'Use LIST partitioning for discrete values like user IDs.',
    },
    {
      id: 'partition-advanced',
      title: 'Advanced Partitioning',
      content: 'Learn to implement more complex partitioning strategies and optimize partitioned queries.',
      exampleQuery: 'CREATE TABLE query_logs (id INT, user_id INT, query TEXT, executed_at TIMESTAMP) PARTITION BY RANGE COLUMNS(user_id, executed_at) (PARTITION p1 VALUES LESS THAN (2, "2024-01-01"), PARTITION p2 VALUES LESS THAN (3, "2024-01-01"), PARTITION p3 VALUES LESS THAN (MAXVALUE, MAXVALUE));',
      exerciseQuery: 'SELECT * FROM query_logs PARTITION (p1, p2) WHERE executed_at >= "2023-01-01" AND executed_at < "2024-01-01";',
      expectedResult: 'SELECT * FROM query_logs PARTITION (p1, p2) WHERE executed_at >= "2023-01-01" AND executed_at < "2024-01-01";',
      hint: 'Use PARTITION clause to limit the search to specific partitions.',
    }
  ],
  'materialized-views': [
    {
      id: 'mv-basics',
      title: 'Materialized Views Basics',
      content: 'Learn to use materialized views for pre-computed results and improved performance.',
      exampleQuery: 'CREATE MATERIALIZED VIEW user_query_stats AS SELECT u.username, COUNT(sq.id) as query_count, MAX(sq.created_at) as last_query FROM users u LEFT JOIN saved_queries sq ON u.id = sq.user_id GROUP BY u.id, u.username;',
      exerciseQuery: 'CREATE MATERIALIZED VIEW popular_queries AS SELECT query, COUNT(*) as execution_count FROM query_logs GROUP BY query ORDER BY execution_count DESC LIMIT 100;',
      expectedResult: 'CREATE MATERIALIZED VIEW popular_queries AS SELECT query, COUNT(*) as execution_count FROM query_logs GROUP BY query ORDER BY execution_count DESC LIMIT 100;',
      hint: 'Use materialized views for frequently accessed aggregated data.',
    },
    {
      id: 'mv-advanced',
      title: 'Advanced Materialized Views',
      content: 'Learn to manage materialized view refreshes and optimize their usage.',
      exampleQuery: 'CREATE MATERIALIZED VIEW user_query_stats REFRESH FAST ON COMMIT AS SELECT u.username, COUNT(sq.id) as query_count, MAX(sq.created_at) as last_query FROM users u LEFT JOIN saved_queries sq ON u.id = sq.user_id GROUP BY u.id, u.username;',
      exerciseQuery: 'CREATE MATERIALIZED VIEW query_performance REFRESH COMPLETE START WITH SYSDATE NEXT SYSDATE + INTERVAL "1" HOUR AS SELECT query, AVG(execution_time) as avg_time, COUNT(*) as execution_count FROM query_logs WHERE executed_at >= SYSDATE - INTERVAL "7" DAY GROUP BY query;',
      expectedResult: 'CREATE MATERIALIZED VIEW query_performance REFRESH COMPLETE START WITH SYSDATE NEXT SYSDATE + INTERVAL "1" HOUR AS SELECT query, AVG(execution_time) as avg_time, COUNT(*) as execution_count FROM query_logs WHERE executed_at >= SYSDATE - INTERVAL "7" DAY GROUP BY query;',
      hint: 'Use REFRESH COMPLETE for complex aggregations that change frequently.',
    }
  ],
  'query-optimization': [
    {
      id: 'optimization-basics',
      title: 'Query Optimization Basics',
      content: 'Learn fundamental techniques for analyzing and optimizing SQL queries.',
      exampleQuery: 'EXPLAIN SELECT u.username, COUNT(sq.id) FROM users u LEFT JOIN saved_queries sq ON u.id = sq.user_id GROUP BY u.id, u.username;',
      exerciseQuery: 'EXPLAIN ANALYZE SELECT u.username, sq.title FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id WHERE u.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) AND sq.title LIKE "%SELECT%";',
      expectedResult: 'EXPLAIN ANALYZE SELECT u.username, sq.title FROM users u INNER JOIN saved_queries sq ON u.id = sq.user_id WHERE u.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) AND sq.title LIKE "%SELECT%";',
      hint: 'Use EXPLAIN ANALYZE to get actual execution statistics.',
    },
    {
      id: 'optimization-advanced',
      title: 'Advanced Query Optimization',
      content: 'Learn advanced techniques for optimizing complex queries and improving database performance.',
      exampleQuery: 'SELECT /*+ INDEX(u idx_username) */ u.username, sq.title FROM users u USE INDEX (idx_username) INNER JOIN saved_queries sq FORCE INDEX (idx_user_id) ON u.id = sq.user_id WHERE u.username LIKE "john%" AND sq.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY);',
      exerciseQuery: 'SELECT u.username, sq.title FROM users u STRAIGHT_JOIN saved_queries sq ON u.id = sq.user_id WHERE u.id IN (SELECT user_id FROM (SELECT user_id, COUNT(*) as query_count FROM saved_queries GROUP BY user_id HAVING COUNT(*) > 10) as active_users) ORDER BY sq.created_at DESC;',
      expectedResult: 'SELECT u.username, sq.title FROM users u STRAIGHT_JOIN saved_queries sq ON u.id = sq.user_id WHERE u.id IN (SELECT user_id FROM (SELECT user_id, COUNT(*) as query_count FROM saved_queries GROUP BY user_id HAVING COUNT(*) > 10) as active_users) ORDER BY sq.created_at DESC;',
      hint: 'Use STRAIGHT_JOIN to force a specific join order.',
    }
  ],
  'data-warehousing': [
    {
      id: 'warehouse-basics',
      title: 'Data Warehousing Basics',
      content: 'Learn about star schemas, fact tables, and dimension tables in data warehousing.',
      exampleQuery: 'CREATE TABLE dim_users (user_key INT PRIMARY KEY, user_id INT, username VARCHAR(255), email VARCHAR(255), valid_from TIMESTAMP, valid_to TIMESTAMP); CREATE TABLE fact_queries (query_key INT PRIMARY KEY, user_key INT, date_key INT, query_count INT, execution_time_sum INT, FOREIGN KEY (user_key) REFERENCES dim_users(user_key), FOREIGN KEY (date_key) REFERENCES dim_dates(date_key));',
      exerciseQuery: 'CREATE TABLE dim_dates (date_key INT PRIMARY KEY, full_date DATE, day_of_week INT, month INT, quarter INT, year INT); CREATE TABLE fact_query_performance (query_key INT PRIMARY KEY, date_key INT, user_key INT, execution_count INT, avg_execution_time INT, FOREIGN KEY (date_key) REFERENCES dim_dates(date_key), FOREIGN KEY (user_key) REFERENCES dim_users(user_key));',
      expectedResult: 'CREATE TABLE dim_dates (date_key INT PRIMARY KEY, full_date DATE, day_of_week INT, month INT, quarter INT, year INT); CREATE TABLE fact_query_performance (query_key INT PRIMARY KEY, date_key INT, user_key INT, execution_count INT, avg_execution_time INT, FOREIGN KEY (date_key) REFERENCES dim_dates(date_key), FOREIGN KEY (user_key) REFERENCES dim_users(user_key));',
      hint: 'Use surrogate keys (date_key, user_key) for better performance in joins.',
    },
    {
      id: 'warehouse-advanced',
      title: 'Advanced Data Warehousing',
      content: 'Learn to implement ETL processes and optimize data warehouse queries.',
      exampleQuery: 'INSERT INTO fact_queries (user_key, date_key, query_count, execution_time_sum) SELECT u.user_key, d.date_key, COUNT(*) as query_count, SUM(execution_time) as execution_time_sum FROM query_logs ql JOIN dim_users u ON ql.user_id = u.user_id JOIN dim_dates d ON DATE(ql.executed_at) = d.full_date GROUP BY u.user_key, d.date_key;',
      exerciseQuery: 'SELECT d.year, d.quarter, u.username, SUM(fq.query_count) as total_queries, AVG(fq.execution_time_sum/fq.query_count) as avg_execution_time FROM fact_queries fq JOIN dim_users u ON fq.user_key = u.user_key JOIN dim_dates d ON fq.date_key = d.date_key GROUP BY d.year, d.quarter, u.username WITH ROLLUP;',
      expectedResult: 'SELECT d.year, d.quarter, u.username, SUM(fq.query_count) as total_queries, AVG(fq.execution_time_sum/fq.query_count) as avg_execution_time FROM fact_queries fq JOIN dim_users u ON fq.user_key = u.user_key JOIN dim_dates d ON fq.date_key = d.date_key GROUP BY d.year, d.quarter, u.username WITH ROLLUP;',
      hint: 'Use WITH ROLLUP for hierarchical aggregations.',
    }
  ],
  'database-security': [
    {
      id: 'security-basics',
      title: 'Database Security Basics',
      content: 'Learn fundamental database security concepts and implementation.',
      exampleQuery: 'CREATE USER "query_reader"@"localhost" IDENTIFIED BY "secure_password"; GRANT SELECT ON sql_playground.* TO "query_reader"@"localhost";',
      exerciseQuery: 'CREATE ROLE query_editor; GRANT SELECT, INSERT, UPDATE ON sql_playground.saved_queries TO query_editor; GRANT query_editor TO "john_doe"@"localhost";',
      expectedResult: 'CREATE ROLE query_editor; GRANT SELECT, INSERT, UPDATE ON sql_playground.saved_queries TO query_editor; GRANT query_editor TO "john_doe"@"localhost";',
      hint: 'Use roles to manage permissions for groups of users.',
    },
    {
      id: 'security-advanced',
      title: 'Advanced Database Security',
      content: 'Learn to implement row-level security and other advanced security features.',
      exampleQuery: 'CREATE POLICY user_queries_policy ON saved_queries USING (user_id = CURRENT_USER_ID()); ALTER TABLE saved_queries ENABLE ROW LEVEL SECURITY;',
      exerciseQuery: 'CREATE FUNCTION get_user_queries() RETURNS TABLE (id INT, title VARCHAR(255), query TEXT) AS $$ BEGIN RETURN QUERY SELECT sq.id, sq.title, CASE WHEN sq.is_public THEN sq.query ELSE NULL END FROM saved_queries sq WHERE sq.user_id = CURRENT_USER_ID() OR sq.is_public = true; END; $$ LANGUAGE plpgsql SECURITY DEFINER;',
      expectedResult: 'CREATE FUNCTION get_user_queries() RETURNS TABLE (id INT, title VARCHAR(255), query TEXT) AS $$ BEGIN RETURN QUERY SELECT sq.id, sq.title, CASE WHEN sq.is_public THEN sq.query ELSE NULL END FROM saved_queries sq WHERE sq.user_id = CURRENT_USER_ID() OR sq.is_public = true; END; $$ LANGUAGE plpgsql SECURITY DEFINER;',
      hint: 'Use SECURITY DEFINER to run functions with the privileges of the creator.',
    }
  ],
  'backup-recovery': [
    {
      id: 'backup-basics',
      title: 'Backup Basics',
      content: 'Learn fundamental database backup strategies and implementation.',
      exampleQuery: 'BACKUP DATABASE sql_playground TO DISK = "/backups/sql_playground.bak" WITH INIT, NAME = "Full Backup", DESCRIPTION = "Full database backup";',
      exerciseQuery: 'BACKUP DATABASE sql_playground TO DISK = "/backups/sql_playground_diff.bak" WITH DIFFERENTIAL, NAME = "Differential Backup", DESCRIPTION = "Differential backup since last full backup";',
      expectedResult: 'BACKUP DATABASE sql_playground TO DISK = "/backups/sql_playground_diff.bak" WITH DIFFERENTIAL, NAME = "Differential Backup", DESCRIPTION = "Differential backup since last full backup";',
      hint: 'Use differential backups to save space and time.',
    },
    {
      id: 'recovery-advanced',
      title: 'Advanced Recovery',
      content: 'Learn to implement point-in-time recovery and disaster recovery strategies.',
      exampleQuery: 'RESTORE DATABASE sql_playground FROM DISK = "/backups/sql_playground.bak" WITH NORECOVERY; RESTORE LOG sql_playground FROM DISK = "/backups/sql_playground_log.trn" WITH STOPAT = "2024-01-01 12:00:00", RECOVERY;',
      exerciseQuery: 'RESTORE DATABASE sql_playground FROM DISK = "/backups/sql_playground.bak" WITH NORECOVERY; RESTORE DATABASE sql_playground FROM DISK = "/backups/sql_playground_diff.bak" WITH NORECOVERY; RESTORE LOG sql_playground FROM DISK = "/backups/sql_playground_log.trn" WITH STOPAT = "2024-01-01 12:00:00", RECOVERY;',
      expectedResult: 'RESTORE DATABASE sql_playground FROM DISK = "/backups/sql_playground.bak" WITH NORECOVERY; RESTORE DATABASE sql_playground FROM DISK = "/backups/sql_playground_diff.bak" WITH NORECOVERY; RESTORE LOG sql_playground FROM DISK = "/backups/sql_playground_log.trn" WITH STOPAT = "2024-01-01 12:00:00", RECOVERY;',
      hint: 'Use NORECOVERY to apply multiple backup files before recovering the database.',
    }
  ],
  'replication': [
    {
      id: 'replication-basics',
      title: 'Replication Basics',
      content: 'Learn fundamental database replication concepts and setup.',
      exampleQuery: 'CHANGE MASTER TO MASTER_HOST="master.example.com", MASTER_USER="repl_user", MASTER_PASSWORD="repl_password", MASTER_LOG_FILE="mysql-bin.000001", MASTER_LOG_POS=107; START SLAVE;',
      exerciseQuery: 'CHANGE MASTER TO MASTER_HOST="master.example.com", MASTER_USER="repl_user", MASTER_PASSWORD="repl_password", MASTER_AUTO_POSITION=1; START SLAVE;',
      expectedResult: 'CHANGE MASTER TO MASTER_HOST="master.example.com", MASTER_USER="repl_user", MASTER_PASSWORD="repl_password", MASTER_AUTO_POSITION=1; START SLAVE;',
      hint: 'Use MASTER_AUTO_POSITION for GTID-based replication.',
    },
    {
      id: 'replication-advanced',
      title: 'Advanced Replication',
      content: 'Learn to implement advanced replication topologies and handle replication failures.',
      exampleQuery: 'STOP SLAVE; CHANGE MASTER TO MASTER_HOST="new_master.example.com", MASTER_USER="repl_user", MASTER_PASSWORD="repl_password", MASTER_AUTO_POSITION=1; START SLAVE;',
      exerciseQuery: 'STOP SLAVE; RESET SLAVE ALL; CHANGE MASTER TO MASTER_HOST="master.example.com", MASTER_USER="repl_user", MASTER_PASSWORD="repl_password", MASTER_AUTO_POSITION=1, MASTER_RETRY_COUNT=10, MASTER_CONNECT_RETRY=60; START SLAVE;',
      expectedResult: 'STOP SLAVE; RESET SLAVE ALL; CHANGE MASTER TO MASTER_HOST="master.example.com", MASTER_USER="repl_user", MASTER_PASSWORD="repl_password", MASTER_AUTO_POSITION=1, MASTER_RETRY_COUNT=10, MASTER_CONNECT_RETRY=60; START SLAVE;',
      hint: 'Use MASTER_RETRY_COUNT and MASTER_CONNECT_RETRY to handle network issues.',
    }
  ],
  'advanced-joins': [
    {
      id: 'self-joins',
      title: 'Self Joins and Hierarchical Data',
      content: 'Learn how to use self-joins to work with hierarchical data structures like organizational charts, category trees, and threaded comments.',
      exampleQuery: `WITH RECURSIVE category_tree AS (
  SELECT id, name, parent_id, 1 as level
  FROM categories
  WHERE parent_id IS NULL
  
  UNION ALL
  
  SELECT c.id, c.name, c.parent_id, ct.level + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT 
  c1.name as parent_category,
  c2.name as child_category,
  c2.level
FROM category_tree c1
JOIN category_tree c2 ON c1.id = c2.parent_id
ORDER BY c1.name, c2.name;`,
      exerciseQuery: `WITH RECURSIVE comment_thread AS (
  SELECT id, content, parent_id, 1 as level
  FROM comments
  WHERE parent_id IS NULL
  
  UNION ALL
  
  SELECT c.id, c.content, c.parent_id, ct.level + 1
  FROM comments c
  JOIN comment_thread ct ON c.parent_id = ct.id
)
SELECT 
  c1.content as parent_comment,
  c2.content as reply,
  c2.level
FROM comment_thread c1
JOIN comment_thread c2 ON c1.id = c2.parent_id
ORDER BY c1.id, c2.level;`,
      expectedResult: `WITH RECURSIVE comment_thread AS (
  SELECT id, content, parent_id, 1 as level
  FROM comments
  WHERE parent_id IS NULL
  
  UNION ALL
  
  SELECT c.id, c.content, c.parent_id, ct.level + 1
  FROM comments c
  JOIN comment_thread ct ON c.parent_id = ct.id
)
SELECT 
  c1.content as parent_comment,
  c2.content as reply,
  c2.level
FROM comment_thread c1
JOIN comment_thread c2 ON c1.id = c2.parent_id
ORDER BY c1.id, c2.level;`,
      hint: 'Use recursive CTEs to traverse hierarchical data structures.'
    },
    {
      id: 'cross-joins',
      title: 'Cross Joins and Cartesian Products',
      content: 'Learn when and how to use cross joins effectively, including generating test data and creating combinations.',
      exampleQuery: `SELECT 
  p1.name as player1,
  p2.name as player2,
  CASE 
    WHEN p1.rating > p2.rating THEN 'Player 1 favored'
    WHEN p1.rating < p2.rating THEN 'Player 2 favored'
    ELSE 'Even match'
  END as prediction
FROM players p1
CROSS JOIN players p2
WHERE p1.id < p2.id
ORDER BY ABS(p1.rating - p2.rating);`,
      exerciseQuery: `SELECT 
  d.date,
  p.product_name,
  COALESCE(s.quantity, 0) as quantity_sold
FROM 
  (SELECT DISTINCT DATE(created_at) as date FROM sales) d
CROSS JOIN 
  (SELECT DISTINCT product_name FROM products) p
LEFT JOIN 
  (SELECT 
    DATE(created_at) as date,
    product_name,
    SUM(quantity) as quantity
   FROM sales
   GROUP BY DATE(created_at), product_name) s
ON d.date = s.date AND p.product_name = s.product_name
ORDER BY d.date, p.product_name;`,
      expectedResult: `SELECT 
  d.date,
  p.product_name,
  COALESCE(s.quantity, 0) as quantity_sold
FROM 
  (SELECT DISTINCT DATE(created_at) as date FROM sales) d
CROSS JOIN 
  (SELECT DISTINCT product_name FROM products) p
LEFT JOIN 
  (SELECT 
    DATE(created_at) as date,
    product_name,
    SUM(quantity) as quantity
   FROM sales
   GROUP BY DATE(created_at), product_name) s
ON d.date = s.date AND p.product_name = s.product_name
ORDER BY d.date, p.product_name;`,
      hint: 'Use CROSS JOIN to generate all possible combinations and LEFT JOIN to fill in actual data.'
    }
  ],
  'advanced-aggregation': [
    {
      id: 'pivot-tables',
      title: 'Creating Pivot Tables',
      content: 'Learn how to transform rows into columns using conditional aggregation to create pivot tables.',
      exampleQuery: `SELECT 
  product_category,
  SUM(CASE WHEN MONTH(sale_date) = 1 THEN amount ELSE 0 END) as jan_sales,
  SUM(CASE WHEN MONTH(sale_date) = 2 THEN amount ELSE 0 END) as feb_sales,
  SUM(CASE WHEN MONTH(sale_date) = 3 THEN amount ELSE 0 END) as mar_sales,
  SUM(amount) as total_sales
FROM sales
WHERE YEAR(sale_date) = 2024
GROUP BY product_category
ORDER BY total_sales DESC;`,
      exerciseQuery: `SELECT 
  department,
  COUNT(CASE WHEN performance_rating = 'Excellent' THEN 1 END) as excellent_count,
  COUNT(CASE WHEN performance_rating = 'Good' THEN 1 END) as good_count,
  COUNT(CASE WHEN performance_rating = 'Average' THEN 1 END) as average_count,
  COUNT(CASE WHEN performance_rating = 'Poor' THEN 1 END) as poor_count,
  COUNT(*) as total_employees,
  ROUND(AVG(salary), 2) as avg_salary
FROM employees
GROUP BY department
ORDER BY department;`,
      expectedResult: `SELECT 
  department,
  COUNT(CASE WHEN performance_rating = 'Excellent' THEN 1 END) as excellent_count,
  COUNT(CASE WHEN performance_rating = 'Good' THEN 1 END) as good_count,
  COUNT(CASE WHEN performance_rating = 'Average' THEN 1 END) as average_count,
  COUNT(CASE WHEN performance_rating = 'Poor' THEN 1 END) as poor_count,
  COUNT(*) as total_employees,
  ROUND(AVG(salary), 2) as avg_salary
FROM employees
GROUP BY department
ORDER BY department;`,
      hint: 'Use CASE statements within aggregate functions to create columns for each category.'
    },
    {
      id: 'advanced-grouping',
      title: 'Advanced Grouping Operations',
      content: 'Learn to use advanced grouping features like ROLLUP, CUBE, and GROUPING SETS for multi-dimensional analysis.',
      exampleQuery: `SELECT 
  COALESCE(region, 'All Regions') as region,
  COALESCE(product_category, 'All Categories') as category,
  SUM(sales_amount) as total_sales,
  COUNT(*) as transaction_count
FROM sales
GROUP BY ROLLUP(region, product_category)
ORDER BY 
  CASE WHEN region IS NULL THEN 1 ELSE 0 END,
  region,
  CASE WHEN product_category IS NULL THEN 1 ELSE 0 END,
  product_category;`,
      exerciseQuery: `SELECT 
  COALESCE(YEAR(order_date), 'All Years') as year,
  COALESCE(QUARTER(order_date), 'All Quarters') as quarter,
  COALESCE(customer_segment, 'All Segments') as segment,
  SUM(order_amount) as total_orders,
  COUNT(DISTINCT customer_id) as unique_customers,
  ROUND(AVG(order_amount), 2) as avg_order_value
FROM orders
GROUP BY GROUPING SETS(
  (YEAR(order_date), QUARTER(order_date), customer_segment),
  (YEAR(order_date), QUARTER(order_date)),
  (YEAR(order_date), customer_segment),
  (QUARTER(order_date), customer_segment),
  (YEAR(order_date)),
  (QUARTER(order_date)),
  (customer_segment),
  ()
)
ORDER BY 
  CASE WHEN year = 'All Years' THEN 1 ELSE 0 END,
  year,
  CASE WHEN quarter = 'All Quarters' THEN 1 ELSE 0 END,
  quarter,
  CASE WHEN segment = 'All Segments' THEN 1 ELSE 0 END,
  segment;`,
      expectedResult: `SELECT 
  COALESCE(YEAR(order_date), 'All Years') as year,
  COALESCE(QUARTER(order_date), 'All Quarters') as quarter,
  COALESCE(customer_segment, 'All Segments') as segment,
  SUM(order_amount) as total_orders,
  COUNT(DISTINCT customer_id) as unique_customers,
  ROUND(AVG(order_amount), 2) as avg_order_value
FROM orders
GROUP BY GROUPING SETS(
  (YEAR(order_date), QUARTER(order_date), customer_segment),
  (YEAR(order_date), QUARTER(order_date)),
  (YEAR(order_date), customer_segment),
  (QUARTER(order_date), customer_segment),
  (YEAR(order_date)),
  (QUARTER(order_date)),
  (customer_segment),
  ()
)
ORDER BY 
  CASE WHEN year = 'All Years' THEN 1 ELSE 0 END,
  year,
  CASE WHEN quarter = 'All Quarters' THEN 1 ELSE 0 END,
  quarter,
  CASE WHEN segment = 'All Segments' THEN 1 ELSE 0 END,
  segment;`,
      hint: 'Use GROUPING SETS to create multiple levels of aggregation in a single query.'
    }
  ],
  'data-analysis': [
    {
      id: 'time-series',
      title: 'Time Series Analysis',
      content: 'Learn to analyze time-series data using window functions and date operations.',
      exampleQuery: `WITH daily_metrics AS (
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as daily_orders,
    SUM(amount) as daily_revenue,
    COUNT(DISTINCT customer_id) as unique_customers
  FROM orders
  GROUP BY DATE(created_at)
)
SELECT 
  date,
  daily_orders,
  daily_revenue,
  unique_customers,
  AVG(daily_orders) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as weekly_avg_orders,
  SUM(daily_revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as weekly_revenue,
  LAG(daily_revenue, 7) OVER (ORDER BY date) as revenue_week_ago,
  ROUND((daily_revenue - LAG(daily_revenue, 7) OVER (ORDER BY date)) / LAG(daily_revenue, 7) OVER (ORDER BY date) * 100, 2) as week_over_week_growth
FROM daily_metrics
ORDER BY date DESC;`,
      exerciseQuery: `WITH monthly_metrics AS (
  SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as total_orders,
    SUM(amount) as total_revenue,
    COUNT(DISTINCT customer_id) as unique_customers,
    SUM(CASE WHEN is_new_customer THEN 1 ELSE 0 END) as new_customers
  FROM orders
  GROUP BY DATE_FORMAT(created_at, '%Y-%m')
)
SELECT 
  month,
  total_orders,
  total_revenue,
  unique_customers,
  new_customers,
  ROUND(total_revenue / unique_customers, 2) as revenue_per_customer,
  ROUND(AVG(total_revenue) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) as three_month_avg_revenue,
  ROUND((total_revenue - LAG(total_revenue) OVER (ORDER BY month)) / LAG(total_revenue) OVER (ORDER BY month) * 100, 2) as month_over_month_growth,
  ROUND((new_customers * 100.0 / unique_customers), 2) as new_customer_percentage
FROM monthly_metrics
ORDER BY month DESC;`,
      expectedResult: `WITH monthly_metrics AS (
  SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as total_orders,
    SUM(amount) as total_revenue,
    COUNT(DISTINCT customer_id) as unique_customers,
    SUM(CASE WHEN is_new_customer THEN 1 ELSE 0 END) as new_customs
  FROM orders
  GROUP BY DATE_FORMAT(created_at, '%Y-%m')
)
SELECT 
  month,
  total_orders,
  total_revenue,
  unique_customers,
  new_customers,
  ROUND(total_revenue / unique_customers, 2) as revenue_per_customer,
  ROUND(AVG(total_revenue) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) as three_month_avg_revenue,
  ROUND((total_revenue - LAG(total_revenue) OVER (ORDER BY month)) / LAG(total_revenue) OVER (ORDER BY month) * 100, 2) as month_over_month_growth,
  ROUND((new_customers * 100.0 / unique_customers), 2) as new_customer_percentage
FROM monthly_metrics
ORDER BY month DESC;`,
      hint: 'Use window functions to calculate running totals, averages, and growth rates.'
    },
    {
      id: 'customer-analytics',
      title: 'Customer Analytics',
      content: 'Learn to analyze customer behavior and calculate key metrics like retention, churn, and lifetime value.',
      exampleQuery: `WITH customer_activity AS (
  SELECT 
    customer_id,
    MIN(created_at) as first_purchase,
    MAX(created_at) as last_purchase,
    COUNT(DISTINCT DATE(created_at)) as active_days,
    COUNT(*) as total_orders,
    SUM(amount) as total_spent
  FROM orders
  GROUP BY customer_id
),
cohort_analysis AS (
  SELECT 
    DATE_FORMAT(first_purchase, '%Y-%m') as cohort_month,
    COUNT(*) as cohort_size,
    COUNT(CASE WHEN DATEDIFF(last_purchase, first_purchase) >= 30 THEN 1 END) as retained_30d,
    COUNT(CASE WHEN DATEDIFF(last_purchase, first_purchase) >= 90 THEN 1 END) as retained_90d,
    ROUND(AVG(total_spent), 2) as avg_lifetime_value,
    ROUND(AVG(total_orders), 2) as avg_orders_per_customer
  FROM customer_activity
  GROUP BY DATE_FORMAT(first_purchase, '%Y-%m')
)
SELECT 
  cohort_month,
  cohort_size,
  ROUND(retained_30d * 100.0 / cohort_size, 2) as retention_rate_30d,
  ROUND(retained_90d * 100.0 / cohort_size, 2) as retention_rate_90d,
  avg_lifetime_value,
  avg_orders_per_customer
FROM cohort_analysis
ORDER BY cohort_month;`,
      exerciseQuery: `WITH customer_segments AS (
  SELECT 
    customer_id,
    CASE 
      WHEN total_orders >= 10 THEN 'VIP'
      WHEN total_orders >= 5 THEN 'Regular'
      ELSE 'New'
    END as segment,
    total_orders,
    total_spent,
    DATEDIFF(CURRENT_DATE, last_purchase) as days_since_last_purchase
  FROM (
    SELECT 
      customer_id,
      COUNT(*) as total_orders,
      SUM(amount) as total_spent,
      MAX(created_at) as last_purchase
    FROM orders
    GROUP BY customer_id
  ) customer_stats
),
segment_metrics AS (
  SELECT 
    segment,
    COUNT(*) as customer_count,
    ROUND(AVG(total_orders), 2) as avg_orders,
    ROUND(AVG(total_spent), 2) as avg_spent,
    ROUND(AVG(days_since_last_purchase), 2) as avg_days_inactive,
    COUNT(CASE WHEN days_since_last_purchase > 90 THEN 1 END) as churned_customers
  FROM customer_segments
  GROUP BY segment
)
SELECT 
  segment,
  customer_count,
  ROUND(customer_count * 100.0 / SUM(customer_count) OVER (), 2) as segment_percentage,
  avg_orders,
  avg_spent,
  avg_days_inactive,
  ROUND(churned_customers * 100.0 / customer_count, 2) as churn_rate
FROM segment_metrics
ORDER BY avg_spent DESC;`,
      expectedResult: `WITH customer_segments AS (
  SELECT 
    customer_id,
    CASE 
      WHEN total_orders >= 10 THEN 'VIP'
      WHEN total_orders >= 5 THEN 'Regular'
      ELSE 'New'
    END as segment,
    total_orders,
    total_spent,
    DATEDIFF(CURRENT_DATE, last_purchase) as days_since_last_purchase
  FROM (
    SELECT 
      customer_id,
      COUNT(*) as total_orders,
      SUM(amount) as total_spent,
      MAX(created_at) as last_purchase
    FROM orders
    GROUP BY customer_id
  ) customer_stats
),
segment_metrics AS (
  SELECT 
    segment,
    COUNT(*) as customer_count,
    ROUND(AVG(total_orders), 2) as avg_orders,
    ROUND(AVG(total_spent), 2) as avg_spent,
    ROUND(AVG(days_since_last_purchase), 2) as avg_days_inactive,
    COUNT(CASE WHEN days_since_last_purchase > 90 THEN 1 END) as churned_customers
  FROM customer_segments
  GROUP BY segment
)
SELECT 
  segment,
  customer_count,
  ROUND(customer_count * 100.0 / SUM(customer_count) OVER (), 2) as segment_percentage,
  avg_orders,
  avg_spent,
  avg_days_inactive,
  ROUND(churned_customers * 100.0 / customer_count, 2) as churn_rate
FROM segment_metrics
ORDER BY avg_spent DESC;`,
      hint: 'Use CASE statements to create customer segments and calculate segment-specific metrics.'
    }
  ]
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
      // Scroll to top of the page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setCurrentQuery('');
    setQueryResult(null);
    // Also scroll to top when going back
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
