import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export interface QueryResult {
  success: boolean;
  results?: any[];
  columns?: string[];
  changes?: number;
  lastId?: number;
  error?: string;
}

export interface SchemaDefinition {
  tables: {
    [key: string]: {
      columns: Array<{
        name: string;
        type: string;
        constraints: string;
      }>;
    };
  };
}

const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`
  };
};

export const executeQuery = async (query: string): Promise<QueryResult> => {
  try {
    console.log('Executing query:', query);
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_BASE_URL}/api/queries/execute`,
      { query },
      { headers }
    );
    console.log('Server response:', response.data);
    
    // Ensure the response has the correct structure
    const result: QueryResult = {
      success: true,
      ...response.data
    };

    // If it's a SELECT query, ensure we have results and columns
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      if (!result.results) {
        result.results = [];
      }
      if (!result.columns && result.results.length > 0) {
        result.columns = Object.keys(result.results[0]);
      }
    }

    return result;
  } catch (error) {
    console.error('Query execution error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

export const fetchSchema = async (): Promise<SchemaDefinition> => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_BASE_URL}/api/schema`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching schema:', error);
    throw error;
  }
};
