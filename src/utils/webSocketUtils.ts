import { Dispatch, SetStateAction } from "react";
import { IAsset, IWSAnswer } from "../components/PortfolioOverview/types";
import { ICoin } from "../store/types";

export const handleWebSocketMessage = (
  message: IWSAnswer,
  setDataWS: Dispatch<SetStateAction<IAsset[]>>,
  coins: ICoin[]
) => {
  setDataWS((prevData) => {
    const price = parseFloat(message.c);
    const change24h = parseFloat(message.P);

    // Формируем обновленный список активов
    const updatedAssets = coins.map((coin) => {
      if (coin.name.toUpperCase() === message.s) {
        const totalValue = coin.quantity * price;
        return {
          id: coin.name,
          name: coin.name.toUpperCase(),
          amount: coin.quantity,
          price,
          totalValue,
          change24h,
          portfolioShare: 0,
        };
      }
      return (
        prevData.find((item) => item.name === coin.name) || {
          id: coin.name,
          name: coin.name.toUpperCase(),
          amount: coin.quantity,
          price: 0,
          totalValue: 0,
          change24h: 0,
          portfolioShare: 0,
        }
      );
    });

    // Общая стоимость портфеля
    const totalPortfolioValue = updatedAssets.reduce((acc, asset) => acc + asset.totalValue, 0);

    // Обновляем долю каждого актива в портфеле
    return updatedAssets.map((asset) => ({
      ...asset,
      portfolioShare: totalPortfolioValue ? (asset.totalValue / totalPortfolioValue) * 100 : 0,
    }));
  });
};
