import { TableProps } from "./types";
import styles from "./styles.module.scss";

export default function Table<T extends { id: string | number }>({
  data,
  columns,
  rowClick,
}: TableProps<T>) {
  return (
    <table className={styles.table}>
      <thead className={styles.table__header}>
        <tr>
          {columns.map((column) => (
            <th key={column.title} className={styles["table__header-cell"]}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className={styles.table__row}
            onClick={() => rowClick && rowClick(item.id)}
          >
            {columns.map((col) => (
              <td key={col.title} className={styles.table__cell}>
                {typeof col.value !== "function" ? item[col.value] : col.value(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
