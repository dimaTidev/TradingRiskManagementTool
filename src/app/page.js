import Image from "next/image";
import Styles from "./page.module.css";
import TradePanel from "./Components/tradePanel";
import { BybitPlatfomAPIContextProvider, TestPlatfomAPIContextProvider } from "./Components/platformAPIContext";
import TradePanelBybit from "./Panel/tradePanelBybit";
import { SideToastContextProvider } from "./Panel/messageManager/messageManager";
import TestUIComponents from "@/lib/UIComponents/Test";
import { AccountsContextProvider } from "./Panel/Accounts/accountsContext";
import { AccountSelectedContextProvider } from "./Panel/Accounts/accountSelectedContext";
import { PlatformsContextProvider } from "./Components/PlatformsAPI/platformsContext";
import CheckAccountsPassword from "./Panel/Accounts/checkAccountPassword";

export default function Home() {
  return (
    <div className={Styles.page}>
      {/* <TestUIComponents/> */}
      <SideToastContextProvider>

        <PlatformsContextProvider>
          <AccountsContextProvider>
            <AccountSelectedContextProvider>

                <BybitPlatfomAPIContextProvider>
                  <TradePanelBybit/>
                </BybitPlatfomAPIContextProvider>

                <CheckAccountsPassword/>

            </AccountSelectedContextProvider>
          </AccountsContextProvider>
        </PlatformsContextProvider>

      </SideToastContextProvider>
    </div>
  );
}
