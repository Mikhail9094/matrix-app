import { useCallback, useMemo, useState } from "react";
import Modal from "../Modal";
import CoinsLists from "../CoinsLists";
import styles from "./PortfolioOverview.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import useWebSocket from "../../hooks/useWebSocket";
import { IAsset, IWSAnswer } from "./types";
import { handleWebSocketMessage } from "../../utils/webSocketUtils";
import Table from "../Table";
import { columns } from "./constants";
import { deleteCoin } from "../../store/coinsSlice";
import { ICoin } from "../../store/types";

export default function PortfolioOverview() {
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [dataTable, setDataTable] = useState<IAsset[]>([]);

  const dispatch = useAppDispatch();
  const { coins } = useAppSelector((state) => state.coins);

  const webSocketURL = useMemo(() => {
    const streams = coins.map((symbol) => `${symbol.name.toLowerCase()}@ticker`).join("/");
    return `wss://stream.binance.com:9443/stream?streams=${streams}`;
  }, [coins]);

  const memoizedHandleMessage = useCallback(
    (message: IWSAnswer) => handleWebSocketMessage(message, setDataTable, coins),
    [coins]
  );

  useWebSocket<IWSAnswer>({
    url: webSocketURL,
    onMessage: memoizedHandleMessage,
    enable: coins.length > 0,
  });

  const toggleModel = useCallback(() => {
    setIsOpenModel((prev) => !prev);
  }, []);

  const deleteRow = useCallback(
    (id: string | number) => {
      dispatch(deleteCoin(id));

      const existingCoins: ICoin[] = JSON.parse(localStorage.getItem("coins") || "[]");
      const updatedLStorage = existingCoins.filter((coin: { name: string }) => coin.name !== id);
      localStorage.setItem("coins", JSON.stringify(updatedLStorage));

      const updatedDataTable = dataTable.filter((item) => item.name !== id);
      setDataTable(updatedDataTable);
    },
    [dataTable, dispatch]
  );

  return (
    <>
      <header className={styles.header}>
        <span className={styles.header__logo}>Portfolio Overview</span>
        <button className={styles.header__button} onClick={toggleModel}>
          Добавить
        </button>
      </header>
      <main className={styles["main-content"]}>
        {dataTable.length === 0 && coins.length > 0 ? (
          <span className={styles["main-content__text"]}>Загрузка данных...</span>
        ) : dataTable.length > 0 ? (
          <Table data={dataTable} columns={columns} rowClick={deleteRow} />
        ) : (
          <span className={styles["main-content__text"]}>
            Нет активов в вашем портфеле. Добавьте что-нибудь, чтобы начать!
          </span>
        )}
      </main>
      <Modal isOpen={isOpenModel} onClose={toggleModel} title="Имеющиеся монеты">
        <CoinsLists isOpen={isOpenModel} closeModal={toggleModel} />
      </Modal>
    </>
  );
}
