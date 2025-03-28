import { ColumnType } from "../Table/types";
import { IAsset } from "./types";

export const columns: ColumnType<IAsset>[] = [
  {
    title: "Монета",
    value: "name",
  },
  {
    title: "Количество",
    value: "amount",
  },
  {
    title: "Цена",
    value: (item) => {
      return item.price.toFixed(2);
    },
  },
  {
    title: "Общая стоимость",
    value: (item) => {
      return item.totalValue.toFixed(2);
    },
  },
  {
    title: "Изм. за 24ч",
    value: (item) => {
      const change = Number(item.change24h.toFixed(2));
      if (change >= 0) {
        return <span style={{ color: "green" }}>{change}</span>;
      }
      return <span style={{ color: "red" }}>{change}</span>;
    },
  },
  {
    title: "% портфеля",
    value: (item) => {
      return item.portfolioShare.toFixed(2);
    },
  },
];
