'use client';

import React, { useEffect, useState } from 'react'
import { createClient, getAccountInfo, getTickerInfo, getTickerPricing, submitOrder } from './PlatformsAPI/bybit';
import { decryptData, encryptData } from '@/lib/encryption/EncryptionController';

// Create a context and use it within the component
export const PlatformAPIContext = React.createContext({
    setAPICredentials(apiKey, apiSecret, password){},
    /**
     * @param {Object} params 
     * @param {string} params.ticker 
     * @param {string} params.orderType 
     * @param {Number} params.assetVolume 
     * @param {Number} params.leverage 
     * @param {Number} params.orderPrice 
     * @param {Number} params.takeProfitPrice 
     * @param {Number} params.stopLossPrice 
     */
    placeShortOrder(params){},
    /**
     * @param {Object} params 
     * @param {string} params.ticker 
     * @param {string} params.orderType 
     * @param {Number} params.assetVolume 
     * @param {Number} params.leverage 
     * @param {Number} params.orderPrice 
     * @param {Number} params.takeProfitPrice 
     * @param {Number} params.stopLossPrice 
     */
    placeLongOrder(params){},
    getTickerInfo(ticker){}, 
    getTickerPricing(ticker){},
    CheckCredentialsSaved: false,
    CheckCredentialsAndPasswordSaved: false,
    deleteCredentials(){},
    setPassword(passkey){},
    isDemoTrading: false
});

//useContext(PlatformAPIContext);

const bybitAPIKeyStorageKey = "qGN5KuuVNg9sJQl";
const bybitAPISecretStorageKey = "IHzJQlbNOs+Y5sfiuuVNg9f";
const bybitAPIPassKey = "dghk58fjo38jf2";



export function BybitPlatfomAPIContextProvider({ children }) {
    //const [_, setRedraw] = useReducer(s => s + 1, 0);
    const [isInitialized, setInitialized] = useState(false);
    const [demoTrading, setDemoTrading] = useState(false);
    const [apiKey, setapiKey] = useState("");
    const [apiSecret, setapiSecret] = useState("");
    const [passkey, setPassKey] = useState("");

    useEffect(() => {
        setInitialized(false);
        const logIn = async () => {
            try {
                const apiKey = localStorage.getItem(bybitAPIKeyStorageKey);
                const apiSecret = localStorage.getItem(bybitAPISecretStorageKey);
                const passKey = decryptData("passkey", sessionStorage.getItem(bybitAPIPassKey));
                const demoTrading = localStorage.getItem("demoTrading");
                
                const responce = await checkPassword(apiKey, apiSecret, passKey, demoTrading);
                if(responce != undefined){
                    setPassKey(undefined);
                }

                setapiKey(apiKey);
                setapiSecret(apiSecret);
                setDemoTrading(demoTrading);

            } catch (error) {
                console.error(error);
            }

            setInitialized(true);
        }
        
        logIn();
        
    }, []);

    if(!isInitialized)
        return;

    async function handleSetAPICredentials(apiKey, apiSecret, password, demoTrading){
        const enctypredAPIKey = encryptData(password, apiKey);
        const enctypredAPISecret = encryptData(password, apiSecret);

        const responce = await checkPassword(enctypredAPIKey, enctypredAPISecret, password, demoTrading);

        if(responce == undefined || responce == "" || responce == "OK"){
            setapiKey(enctypredAPIKey);
            setapiSecret(enctypredAPISecret);
            setDemoTrading(demoTrading);
    
            localStorage.setItem(bybitAPIKeyStorageKey, enctypredAPIKey);
            localStorage.setItem(bybitAPISecretStorageKey, enctypredAPISecret);
            localStorage.setItem("demoTrading", demoTrading);
        }

        return {
            errorMsg: responce 
        }
    }

    /**
     * @param {Object} params 
     * @param {string} params.ticker 
     * @param {string} params.orderType 
     * @param {Number} params.assetVolume 
     * @param {Number} params.leverage 
     * @param {Number} params.orderPrice 
     * @param {Number} params.takeProfitPrice 
     * @param {Number} params.stopLossPrice 
     */
    async function handlePlaceShortOrder(params){
        console.log("place short order");
        // TODO: add error message handling!
        try {
            submitOrder(
                params.ticker,
                "Short",
                params.orderType,
                params.assetVolume,
                params.leverage,
                params.orderPrice,
                params.takeProfitPrice,
                params.stopLossPrice
            );
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @param {Object} params 
     * @param {string} params.ticker 
     * @param {string} params.orderType 
     * @param {Number} params.assetVolume 
     * @param {Number} params.leverage 
     * @param {Number} params.orderPrice 
     * @param {Number} params.takeProfitPrice 
     * @param {Number} params.stopLossPrice 
     */
    async function handlePlaceLongOrder(params){
        console.log("place long order");
        // TODO: add error message handling!
        try {
            submitOrder(
                params.ticker,
                "Long",
                params.orderType,
                params.assetVolume,
                params.leverage,
                params.orderPrice,
                params.takeProfitPrice,
                params.stopLossPrice
            );
        } catch (error) {
            console.log(error);
        }
    }

    async function handleGetTickerInfo(ticker){
        try {
            return await getTickerInfo(ticker);
        } catch (error) {
            console.log(error);
        }
    }
    
    async function handleGetTickerPricing(ticker){
        try {
            return await getTickerPricing(ticker);
        } catch (error) {
            console.log(error);
        }
    }

    function handleDeleteCredentials(){
        setapiKey(undefined);
        setapiSecret(undefined);
        setPassKey(undefined);
        setDemoTrading(undefined);

        localStorage.removeItem(bybitAPIKeyStorageKey);
        localStorage.removeItem(bybitAPISecretStorageKey);
        localStorage.removeItem("demoTrading");
        sessionStorage.removeItem(bybitAPIPassKey);
    }

    async function handleSetPassword(passkey){
        return checkPassword(apiKey, apiSecret, passkey, demoTrading);
    }

    async function checkPassword(apiKey, apiSecret, passkey, demoTrading){
        // Check the pass key
        if(passkey == undefined || passkey == ""){
            // TODO: throw an error message
            return;
        }

        // Check the saved credentials!
        if(apiKey == undefined || apiKey == "" || apiSecret == undefined || apiSecret == ""){
            // TODO: throw an error message
            return;
        }

        // decryptData credentials

        let decodedApiKey;
        let decodedApiSecret;

        try {
            decodedApiKey = decryptData(passkey, apiKey);
            decodedApiSecret = decryptData(passkey, apiSecret);
        } catch (error) {
            return "Decryption failure"
        }

        // Try to create a client
        await createClient(decodedApiKey, decodedApiSecret, demoTrading);

        console.log("decodedApiKey", decodedApiKey);
        console.log("decodedApiSecret", decodedApiSecret);
        
        // Verify credentials
        const responce = await getAccountInfo();

        console.log("responce", responce);

        if(responce.retCode == 0 && responce.retMsg == "OK"){
            console.log("Success"); 
            sessionStorage.setItem(bybitAPIPassKey, encryptData("passkey", passkey));
            setPassKey(passkey);
        }else{
            console.log("Failure");
            return responce.retMsg;
        }

        return undefined;
    }

    return (
        <PlatformAPIContext.Provider value={{
            setAPICredentials: handleSetAPICredentials,
            placeShortOrder: handlePlaceShortOrder,
            placeLongOrder: handlePlaceLongOrder,
            getTickerInfo: handleGetTickerInfo,
            getTickerPricing: handleGetTickerPricing,
            CheckCredentialsSaved: () => apiKey != undefined && apiSecret != undefined,
            CheckCredentialsAndPasswordSaved: () => apiKey != undefined && apiSecret != undefined && passkey != null && passkey != "",
            deleteCredentials: handleDeleteCredentials,
            setPassword: handleSetPassword,
            isDemoTrading: demoTrading
        }}>
            {children}
        </PlatformAPIContext.Provider>
    )
};



export function TestPlatfomAPIContextProvider({ children }) {
    return (
        <PlatformAPIContext.Provider value={{
            setAPICredentials: (params) => console.log("setAPICredentials", params),
            placeShortOrder: (params) => console.log("placeShortOrder", params),
            placeLongOrder: (params) => console.log("placeLongOrder", params),
            getTickerInfo: (params) => console.log("getTickerInfo", params),
            getTickerPricing: (params) => console.log("getTickerPricing", params),
            CheckCredentialsSaved: () => true,
            CheckCredentialsAndPasswordSaved: () => true,
            deleteCredentials: (params) => console.log("deleteCredentials", params),
            setPassword: (params) => console.log("setPassword", params),
            isDemoTrading: () => true
        }}>
            {children}
        </PlatformAPIContext.Provider>
    )
}