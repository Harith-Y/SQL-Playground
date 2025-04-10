import { QueryResult } from './api';

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

export interface SavedState {
  schema: SchemaDefinition;
  queries: Array<{
    title: string;
    query: string;
    result?: QueryResult;
  }>;
}

export const exportState = (schema: SchemaDefinition, queries: Array<{ title: string; query: string; result?: QueryResult }>) => {
  const state: SavedState = {
    schema,
    queries,
  };
  
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sql-playground-state.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importState = (file: File): Promise<SavedState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const state = JSON.parse(event.target?.result as string) as SavedState;
        resolve(state);
      } catch (error) {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};
