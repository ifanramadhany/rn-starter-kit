declare module 'react-native-sqlite-storage' {
  export type SQLResultSetRowList = {
    length: number;
    item: (index: number) => unknown;
    raw: () => unknown[];
  };

  export type ResultSet = {
    insertId: number;
    rowsAffected: number;
    rows: SQLResultSetRowList;
  };

  export type Transaction = {
    executeSql: (statement: string, params?: unknown[]) => Promise<[Transaction, ResultSet]>;
  };

  export type SQLiteDatabase = {
    executeSql: (statement: string, params?: unknown[]) => Promise<[ResultSet]>;
    sqlBatch: (statements: Array<string | [string, unknown[]]>) => Promise<void>;
    transaction: (scope: (tx: Transaction) => void | Promise<void>) => Promise<void>;
    close: () => Promise<void>;
  };

  export type OpenDatabaseParams = {
    name: string;
    location?: 'default' | 'Library' | 'Documents' | 'Shared';
    createFromLocation?: number | string;
    readOnly?: boolean;
  };

  export type SQLiteFactory = {
    enablePromise: (enabled: boolean) => void;
    openDatabase: {
      (params: OpenDatabaseParams): Promise<SQLiteDatabase>;
      (
        name: string,
        version?: string,
        displayName?: string,
        size?: number,
      ): Promise<SQLiteDatabase>;
    };
  };

  const SQLite: SQLiteFactory;
  export default SQLite;
}
