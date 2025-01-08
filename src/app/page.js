import Image from "next/image";
import Styles from "./page.module.css";
import TradePanel from "./Components/tradePanel";
import { PlatformAPIContextProvider } from "./Components/platformAPIContext";

export default function Home() {
  return (
    <div className={Styles.page}>
      <PlatformAPIContextProvider>
        <TradePanel/>
      </PlatformAPIContextProvider>
    </div>
  );
}
