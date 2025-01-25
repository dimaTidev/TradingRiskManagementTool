'use client'

import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import AccountList, { AccountCreationButton } from './accountList';
import InputField from '@/lib/UIComponents/InputField';
import { encryptData, decryptData } from '@/lib/encryption/EncryptionController';
import { TestAccountsContextProvider } from './testAccountsContextProvider';
// import { decryptData, encryptData } from '@/lib/encryption/EncryptionController';

export const AccountsContext = React.createContext({
    createAccount(params){},
    removeAccount(guid){},
    decryptAccount(data){},
    getAccountForGUID(guid){},
    allAccounts: []
});

const connectedAccountsKey = "vm49idfji31nf03jc66tgg";

export function AccountsContextProvider({ children }) {
    const [_, setRedraw] = useReducer(s => s + 1, 0);
    const accounts = useRef(new Map());

    useEffect(() => {
        accounts.current = loadAccounts();
        setRedraw();
    }, []);

    function saveAccounts(map){
        const object = Object.fromEntries(map);
        const jsonObject = JSON.stringify(object);
        
        localStorage.setItem(connectedAccountsKey, jsonObject);
    }

    function loadAccounts(){
        const object = localStorage.getItem(connectedAccountsKey);

        try {
            return new Map(Object.entries(JSON.parse(object)));
        } catch (error) {
            
        }
        
        return new Map();
    }

    // TODO: add a password for decryption
    function decryptAccount(data){
        
        return decryptData("33", data);
    }

    function getAccountForGUID(guid){
        return accounts.current?.has(guid) ? decryptData("33", accounts.current.get(guid)) : undefined;
    }

    function createAccount(params){
        const guid = uuidv4();
        params = {guid: guid, ...params};

        // TODO: add a password for encryption
        params = encryptData("33", params);

        accounts.current.set(guid, params);

        console.log("data to save", params);
        
        saveAccounts(accounts.current);
        setRedraw();

        return guid;
    }

    function removeAccount(guid){
        if(!accounts.current.has(guid)){
            return false;
        }

        accounts.current.delete(guid);

        saveAccounts(accounts.current);
        setRedraw();

        return true;
    }

    return (
        <AccountsContext.Provider value={{
            createAccount,
            removeAccount,
            allAccounts: Array.from(accounts.current, ([name, value]) => (value)),
            decryptAccount,
            getAccountForGUID
        }}>
            {/* <TestAccountsContextProvider/> */}
            {children}
        </AccountsContext.Provider>
    )
}