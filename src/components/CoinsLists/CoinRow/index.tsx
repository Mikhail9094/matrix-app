import React from "react";
import styles from "./row.module.scss";
import { ICoinUSDT } from "../../../api/types";

interface CoinRowProps {
  coin: ICoinUSDT;
  style: React.CSSProperties;
}

const CoinRow: React.FC<CoinRowProps> = ({ coin, style }) => {
  const priceChangePercent = parseFloat(coin.priceChangePercent);
  const priceChangeClass = priceChangePercent >= 0 ? styles.positive : styles.negative;

  return (
    <div style={style} className={styles["coin-row"]}>
      <span>{coin.symbol}</span>
      <span>{parseFloat(coin.lastPrice).toFixed(5)}</span>
      <span className={priceChangeClass}>{parseFloat(coin.priceChangePercent).toFixed(2)}%</span>
    </div>
  );
};

export default CoinRow;
