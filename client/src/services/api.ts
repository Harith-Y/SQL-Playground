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

export const executeQuery = async (query: string): Promise<QueryResult> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be logged in to execute queries');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/queries/execute`, {
      query,
      userId: user.uid
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to execute query');
    }
    throw error;
  }
};

export const fetchSchema = async (): Promise<SchemaDefinition> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be logged in to fetch schema');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/schema`, {
      params: { userId: user.uid }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch schema');
    }
    throw error;
  }
};

export const createTablesFromSchema = async (schema: SchemaDefinition): Promise<QueryResult> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be logged in to create tables');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/schema/create`, {
      schema,
      userId: user.uid
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to create tables');
    }
    throw error;
  }
};
