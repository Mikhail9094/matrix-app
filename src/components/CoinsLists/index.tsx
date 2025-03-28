import { useEffect, useMemo, useState } from "react";
import { SelectionCionsProps } from "./types";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import CoinRow from "./CoinRow";
import styles from "./selectionCoin.module.scss";
import { ICoinUSDT } from "../../api/types";
import { fetchUsdtCoins } from "../../api/fetchUsdtСoins";
import { useAppDispatch } from "../../store/hooks";
import { addCoin } from "../../store/coinsSlice";
import { ICoin } from "../../store/types";

export default function CoinsLists({ isOpen, closeModal }: SelectionCionsProps) {
  const [filter, setFilter] = useState<string>("");
  const [coins, setCoins] = useState<ICoinUSDT[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<ICoinUSDT | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCoins = async () => {
      setIsLoading(true);
      try {
        const usdtCoins = await fetchUsdtCoins();
        setCoins(usdtCoins);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCoin(null);
      setQuantity("1");
    }
  }, [isOpen]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleInputQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  const handleRowClick = (coin: ICoinUSDT) => {
    setSelectedCoin(coin);
  };

  const handleCancel = () => {
    if (closeModal) closeModal();
    setSelectedCoin(null);
    setQuantity("1");
  };

  const handleAdd = () => {
    if (selectedCoin && quantity) {
      const coinData = { name: selectedCoin.symbol, quantity: Number(quantity) };

      dispatch(addCoin(coinData));

      const existingCoins: ICoin[] = JSON.parse(localStorage.getItem("coins") || "[]");
      const existingCoinIndex = existingCoins.findIndex((coin) => coin.name === coinData.name);

      if (existingCoinIndex !== -1) {
        existingCoins[existingCoinIndex].quantity += coinData.quantity;
        localStorage.setItem("coins", JSON.stringify(existingCoins));
      } else {
        existingCoins.push(coinData);
        localStorage.setItem("coins", JSON.stringify(existingCoins));
      }

      setSelectedCoin(null);
      setQuantity("1");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const filteredCoins = useMemo(() => {
    return coins.filter((coin) => coin.symbol.toLowerCase().includes(filter.toLowerCase()));
  }, [coins, filter]);

  if (isLoading) <span className={styles.loading}>Загрузка монет... </span>;

  return (
    <>
      <input
        type="text"
        placeholder="Поиск монеты"
        value={filter}
        onChange={handleFilterChange}
        className={styles.search}
      />
      <div className={styles["virtual-list"]}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              className={styles.list}
              height={height}
              width={width}
              itemCount={filteredCoins.length}
              itemSize={50}
            >
              {({ index, style }) => (
                <div onClick={() => handleRowClick(filteredCoins[index])}>
                  <CoinRow coin={filteredCoins[index]} style={style} />
                </div>
              )}
            </List>
          )}
        </AutoSizer>
      </div>
      <div className={`${styles.coinForm} ${selectedCoin ? styles.visible : ""}`}>
        <h3>Выбранная монета: {selectedCoin?.symbol}</h3>
        <div className={styles.inputContainer}>
          <span>Цена: {parseFloat(selectedCoin?.lastPrice || "0").toFixed(2)} $</span>
          <label htmlFor="quantity" className={styles.visuallyHidden}>
            Количество:
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            min="1"
            onChange={handleInputQuantity}
            className={styles.quantityInput}
            aria-label="Количество"
            onKeyDown={handleKeyDown}
          />
          <span>
            Итого: {(parseFloat(selectedCoin?.lastPrice || "0") * Number(quantity)).toFixed(2)} $
          </span>
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={handleCancel} className={styles.cancelButton}>
            Отмена
          </button>
          <button onClick={handleAdd} className={styles.addButton}>
            Добавить
          </button>
        </div>
      </div>
    </>
  );
}
