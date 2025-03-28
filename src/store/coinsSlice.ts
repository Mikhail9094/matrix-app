import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICoin, ICoinsState } from "./types";

const initialState: ICoinsState = {
  coins: [],
};

const coinsSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    addCoin(state, action: PayloadAction<ICoin>) {
      const newCoin = action.payload;
      const existingCoinIndex = state.coins.findIndex((coin) => coin.name === newCoin.name);

      if (existingCoinIndex !== -1) {
        state.coins[existingCoinIndex].quantity += newCoin.quantity;
      } else {
        state.coins.push(newCoin);
      }
    },
    addCoins(state, action: PayloadAction<ICoin[]>) {
      state.coins = action.payload;
    },
    deleteCoin(state, action: PayloadAction<number | string>) {
      state.coins = state.coins.filter((coin) => coin.name !== action.payload);
    },
  },
});

export const { addCoin, addCoins, deleteCoin } = coinsSlice.actions;

export default coinsSlice.reducer;
