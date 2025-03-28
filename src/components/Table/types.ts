export interface TableProps<T extends { id: string | number }> {
  data: T[];
  columns: ColumnType<T>[];
  rowClick?: (id: string | number) => void;
}

export interface ColumnType<T> {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: keyof T | ((item: T) => any);
}
