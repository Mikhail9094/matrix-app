import { toast } from "react-toastify";
import { ICoinUSDT } from "./types";

export const fetchUsdtCoins = async (): Promise<ICoinUSDT[]> => {
  try {
    const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    const data = await response.json();
    const usdtCoins = data.filter((item: ICoinUSDT) => item.symbol.endsWith("USDT"));

    return usdtCoins;
  } catch (error) {
    toast.error(`Ошибка загрузки USDT-монет:, ${error}`);
    return [];
  }
};
