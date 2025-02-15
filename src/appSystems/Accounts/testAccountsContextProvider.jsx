import { useContext } from "react";
import { AccountSelectedContextProvider } from "./accountSelectedContext";
import { AccountsContext } from "./accountsContext";
import AccountList, { AccountCreationButton } from "./accountList";

export function TestAccountsContextProvider() {
    return (
        <AccountSelectedContextProvider saveKey="test_selected_account">
            <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                <AccountList/>
                <AccountCreationButton/>
            </div>
        </AccountSelectedContextProvider>
    )
}