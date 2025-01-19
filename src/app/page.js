import Image from "next/image";
import Styles from "./page.module.css";
import TradePanel from "./Components/tradePanel";
import { BybitPlatfomAPIContextProvider, TestPlatfomAPIContextProvider } from "./Components/platformAPIContext";
import TradePanelBybit from "./Panel/tradePanelBybit";

export default function Home() {
  return (
    <div className={Styles.page}>
      <TestPlatfomAPIContextProvider>
        {/* <TradePanel/> */}
        <TradePanelBybit/>
      </TestPlatfomAPIContextProvider>
    </div>
  );
}
