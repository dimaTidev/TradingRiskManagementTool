import Image from "next/image";
import Styles from "./page.module.css";
import { PlatfomAPIContextProvider, TestPlatfomAPIContextProvider } from "../appSystems/platforms/platformAPIContext";
import { SideToastContextProvider } from "../lib/messageManager/messageManager";
import TestUIComponents from "@/lib/UIComponents/Test";
import { AccountsContextProvider } from "@/appSystems/Accounts/accountsContext"
import { AccountSelectedContextProvider } from "@/appSystems/Accounts/accountSelectedContext";
import { PlatformsContextProvider } from "../appSystems/platforms/PlatformsAPI/platformsContext";
import CheckAccountsPassword from "@/appSystems/Accounts/checkAccountPassword";
import TradePanelBybit from "@/appSystems/Panel/tradePanelBybit";

export default function Home() {
  return (
    <div className={Styles.page}>
      {/* <TestUIComponents/> */}
      <SideToastContextProvider>

        <PlatformsContextProvider>
          <AccountsContextProvider>
            <AccountSelectedContextProvider>

                <PlatfomAPIContextProvider>
                  <TradePanelBybit/>
                </PlatfomAPIContextProvider>

                <CheckAccountsPassword/>

            </AccountSelectedContextProvider>
          </AccountsContextProvider>
        </PlatformsContextProvider>

      </SideToastContextProvider>
    </div>
  );
}
