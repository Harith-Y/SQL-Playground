import axios from 'axios';

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

export const executeQuery = async (query: string): Promise<QueryResult> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/queries/execute`, { query });
    return response.data;
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
    const response = await axios.get(`${API_BASE_URL}/api/schema`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schema:', error);
    throw error;
  }
};
