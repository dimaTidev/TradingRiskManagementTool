'use client'

import React, { useEffect, useReducer, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { encryptData, decryptData } from '@/lib/encryption/EncryptionController';
import bcrypt from 'bcryptjs';

export const AccountsContext = React.createContext({
    createAccount(params){},
    removeAccount(guid){},
    decryptAccount(data){},
    getAccountForGUID(guid){},
    allAccounts: [],

    createPasswordAsync(passkey){},
    checkAndSetPasswordAsync(passkey){},
    isPasswordSaved: false,
    isPasswordChecked: false,
});

const connectedAccountsKey = "vm49idfji31nf03jc66tgg";
const accPassSaveKey = "234590tugj29j0ncjlewd3";

export function AccountsContextProvider({ children }) {
    const [_, setRedraw] = useReducer(s => s + 1, 0);
    const accounts = useRef(new Map());
    const [passKey, setPassKey] = useState(undefined);
    const [isPasswordSaved, setPasswordSaved] = useState(false);

    useEffect(() => {

        // TODO: remove this. It is here only for the test purpose
        // localStorage.removeItem(accPassSaveKey);
        
        if(localStorage.getItem(accPassSaveKey)){
            setPasswordSaved(true);
        }
    }, []);

    useEffect(() => {
        if(passKey == undefined){
            return;
        }
        
        accounts.current = loadAccounts();
        setRedraw();
    }, [passKey]);

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

    function decryptAccount(data){
        return decryptData(passKey, data);
    }

    function getAccountForGUID(guid){
        return accounts.current?.has(guid) ? decryptData(passKey, accounts.current.get(guid)) : undefined;
    }

    function createAccount(params){
        const guid = uuidv4();
        params = {guid: guid, ...params};

        params = encryptData(passKey, params);

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

    async function createPasswordAsync(password){
        if(password == undefined || password == ""){
            return false;
        }

        const resultHash = await makeHash(password);

        if(resultHash == undefined){
            return false;
        }

        localStorage.setItem(accPassSaveKey, resultHash);
        setPassKey(password);
        setPasswordSaved(true);
        console.log("password saved:", resultHash);


        return true;
    }

    async function checkAndSetPasswordAsync(password){
        if(password == undefined || password == ""){
            return false;
        }

        const resultHash = localStorage.getItem(accPassSaveKey);
        const isValid = await validateHash(password, resultHash);

        if(isValid){
            setPassKey(password);
        }
        
        return isValid;
    }

    async function makeHash(value) {
        try {
            // Generate a salt to hash the value
            const salt = await bcrypt.genSalt(10);
            
            // Hash the value with the salt
            const hashedValue = await bcrypt.hash(value, salt);
    
            return hashedValue;
        } catch (error) {
            console.error('Error hashing:', error);
            // throw error;
        }

        return undefined;
    }

    async function validateHash(enteredValue, hash){
        try {
            const isValid = await bcrypt.compare(enteredValue, hash);
            return isValid;
        } catch (error) {
            console.error('Error validating password:', error);
            // throw error;
        }
        return false;
    }

    return (
        <AccountsContext.Provider value={{
            createAccount,
            removeAccount,
            allAccounts: Array.from(accounts.current, ([name, value]) => (value)),
            decryptAccount,
            getAccountForGUID,
            createPasswordAsync,
            checkAndSetPasswordAsync,
            isPasswordSaved: isPasswordSaved,
            isPasswordChecked: passKey != undefined,
        }}>
            {/* <TestAccountsContextProvider/> */}
            {children}
        </AccountsContext.Provider>
    )
}