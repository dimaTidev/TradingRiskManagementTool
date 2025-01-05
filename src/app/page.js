import Image from "next/image";
import Styles from "./page.module.css";
import TradePanel from "./Components/tradePanel";

export default function Home() {
  return (
    <div className={Styles.page}>
      <TradePanel/>
    </div>
  );
}
