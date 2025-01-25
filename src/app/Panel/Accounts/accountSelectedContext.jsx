'use client'

import React, { useContext, useEffect, useState } from 'react'
import { AccountsContext } from './accountsContext';

export const AccountSelectedContext = React.createContext({
    setAccountGUID(guid){},
    getAccountData(){},
    selectedAccountGUID: undefined,
});

export function AccountSelectedContextProvider({ children, saveKey = "selectedAccount" }) {
    const accountsContext = useContext(AccountsContext);
    const [selectedAccountGUID, setSelectedAccountGUID] = useState(undefined);

    useEffect(() => {
        setSelectedAccountGUID(localStorage.getItem(saveKey));
    }, []);

    function setAccountGUID(guid){
        setSelectedAccountGUID(guid);
        localStorage.setItem(saveKey, guid);
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