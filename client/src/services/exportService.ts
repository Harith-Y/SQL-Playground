import { QueryResult } from './api';

export interface SchemaDefinition {
  tables: {
    [key: string]: {
      columns: Array<{
        name: string;
        type: string;
        constraints: string;
      }>;
      data?: any[]; // Add data field to store table contents
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

export const exportState = async (schema: SchemaDefinition, queries: Array<{ title: string; query: string; result?: QueryResult }>) => {
  // Fetch data for each table
  const tablesWithData = { ...schema.tables };
  for (const [tableName, table] of Object.entries(schema.tables)) {
    try {
      const result = await executeQuery(`SELECT * FROM ${tableName}`);
      if (result.success && result.results) {
        tablesWithData[tableName] = {
          ...table,
          data: result.results
        };
      }
    } catch (error) {
      console.error(`Error fetching data for table ${tableName}:`, error);
    }
  }

  const state: SavedState = {
    schema: {
      tables: tablesWithData
    },
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
        
        // Validate the imported state
        if (!state.schema || !state.schema.tables) {
          throw new Error('Invalid schema format in imported file');
        }
        
        // Validate each table's structure
        Object.entries(state.schema.tables).forEach(([tableName, table]) => {
          if (!table.columns || !Array.isArray(table.columns)) {
            throw new Error(`Invalid table format for table ${tableName}`);
          }
          
          table.columns.forEach(column => {
            if (!column.name || !column.type) {
              throw new Error(`Invalid column format in table ${tableName}`);
            }
          });
        });
        
        resolve(state);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};
