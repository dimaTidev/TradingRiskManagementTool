'use client'

import React, { useEffect, useState } from 'react'

export const AccountSelectedContext = React.createContext({
    setAccountGUID(guid){},
    selectedAccountGUID: undefined
});

export function AccountSelectedContextProvider({ children, saveKey = "selectedAccount" }) {
    const [selectedAccountGUID, setSelectedAccountGUID] = useState(undefined);

    useEffect(() => {
        setSelectedAccountGUID(localStorage.getItem(saveKey));
    }, []);

    function setAccountGUID(guid){
        setSelectedAccountGUID(guid);
        localStorage.setItem(saveKey, guid);
    }

    return (
        <AccountSelectedContext.Provider value={{
            setAccountGUID,
            selectedAccountGUID
        }}>
            {children}
        </AccountSelectedContext.Provider>
    )
}