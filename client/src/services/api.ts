const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface QueryResult {
  success: boolean;
  results?: any[];
  columns?: string[];
  changes?: number;
  lastId?: number;
  error?: string;
}

export const executeQuery = async (query: string): Promise<QueryResult> => {
  try {
    const response = await fetch(`${API_URL}/queries/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to execute query');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
};
