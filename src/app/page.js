import Image from "next/image";
import Styles from "./page.module.css";
import TradePanel from "./Components/tradePanel";
import { BybitPlatfomAPIContextProvider, TestPlatfomAPIContextProvider } from "./Components/platformAPIContext";
import TradePanelBybit from "./Panel/tradePanelBybit";
import { SideToastContextProvider } from "./Panel/messageManager/messageManager";

export default function Home() {
  return (
    <div className={Styles.page}>
      <SideToastContextProvider>
        <BybitPlatfomAPIContextProvider>
          {/* <TradePanel/> */}
          <TradePanelBybit/>
        </BybitPlatfomAPIContextProvider>
      </SideToastContextProvider>
    </div>
  );
}
