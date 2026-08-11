/** Local shapes so we never import `@op-engineering/op-sqlite` at module top-level. */

export type SqlScalar = string | number | boolean | null | ArrayBuffer | ArrayBufferView;

export type SqlQueryResult = {
  insertId?: number;
  rowsAffected: number;
  rows: Array<Record<string, SqlScalar>>;
};

export type SqlBatchTuple =
  | [string]
  | [string, SqlScalar[]]
  | [string, SqlScalar[][]];

export type SqlDB = {
  execute: (query: string, params?: SqlScalar[]) => Promise<SqlQueryResult>;
  executeSync: (query: string, params?: SqlScalar[]) => SqlQueryResult;
  executeBatch: (commands: SqlBatchTuple[]) => Promise<{ rowsAffected?: number }>;
  transaction: (
    fn: (tx: {
      execute: (query: string, params?: SqlScalar[]) => Promise<SqlQueryResult>;
      commit: () => Promise<SqlQueryResult>;
      rollback: () => SqlQueryResult;
    }) => Promise<void>,
  ) => Promise<void>;
};
