'use client'

import React, { useContext, useEffect, useState } from 'react'
import { AccountsContext } from './accountsContext';
import { SideToastContext } from '../messageManager/messageManager';

export const AccountSelectedContext = React.createContext({
    setAccountGUID(guid){},
    getAccountData(){},
    selectedAccountGUID: undefined,
});

export function AccountSelectedContextProvider({ children, saveKey = "selectedAccount" }) {
    const accountsContext = useContext(AccountsContext);
    const [selectedAccountGUID, setSelectedAccountGUID] = useState(undefined);
    const sideToastContext = useContext(SideToastContext);

    useEffect(() => {
        setSelectedAccountGUID(localStorage.getItem(saveKey));
    }, []);

    function setAccountGUID(guid){
        if(guid == selectedAccountGUID){
            return;
        }

        setSelectedAccountGUID(guid);
        localStorage.setItem(saveKey, guid);

        sideToastContext.showMessage("Account changed", `Changed to ${accountsContext.getAccountForGUID(guid)?.title}`);
    }

    function getAccountData(){
        return accountsContext.getAccountForGUID(selectedAccountGUID);
    }

    return (
        <AccountSelectedContext.Provider value={{
            setAccountGUID,
            getAccountData,
            selectedAccountGUID
        }}>
            {children}
        </AccountSelectedContext.Provider>
    )
}