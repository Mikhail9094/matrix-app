import { useEffect } from "react";
import "./App.css";
import PortfolioOverview from "./components/PortfolioOverview";
import { addCoins } from "./store/coinsSlice";
import { useAppDispatch } from "./store/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const existingCoins = JSON.parse(localStorage.getItem("coins") || "[]");
    console.log("existingCoins", existingCoins);
    dispatch(addCoins(existingCoins));
  }, [dispatch]);

  return (
    <div className="app">
      <PortfolioOverview />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
