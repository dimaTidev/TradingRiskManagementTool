'use client';

import React, { useEffect, useState } from 'react'
import { createClient, deleteClient, getTickerInfo, getTickerPricing, submitOrder } from './PlatformsAPI/bybit';
import { decryptData, encryptData } from '@/lib/encryption/EncryptionController';

// Create a context and use it within the component
export const PlatformAPIContext = React.createContext({
    setAPICredentials(apiKey, apiSecret, password){},
    placeShortOrder(params){},
    placeLongOrder(params){},
    getTickerInfo(ticker){}, 
    getTickerPricing(ticker){},
    CheckCredentialsSaved: false,
    CheckCredentialsAndPasswordSaved: false,
    deleteCredentials(){},
    setPassword(passkey){}
});

//useContext(PlatformAPIContext);

const bybitAPIKeyStorageKey = "qGN5KuuVNg9sJQl";
const bybitAPISecretStorageKey = "IHzJQlbNOs+Y5sfiuuVNg9f";

export function BybitPlatfomAPIContextProvider({ children }) {
    //const [_, setRedraw] = useReducer(s => s + 1, 0);
    const [isInitialized, setInitialized] = useState(false);
    const [apiKey, setapiKey] = useState(localStorage.getItem(bybitAPIKeyStorageKey));
    const [apiSecret, setapiSecret] = useState(localStorage.getItem(bybitAPISecretStorageKey));
    const [passkey, setPassKey] = useState(undefined);

    useEffect(() => {
        setInitialized(false);
        const createPlatformClient = async () => {
            try {
                deleteClient();

                if(passkey == undefined || passkey == "" || apiKey == undefined || apiSecret == undefined){
                    
                }else{
                    await createClient(decryptData(passkey, apiKey), decryptData(passkey, apiSecret));
                } 
            } catch (error) {
                console.error(error);
            }
            
            setInitialized(true);
        }
        
        createPlatformClient();
        
    }, [apiKey, apiSecret, passkey]);

    if(!isInitialized)
        return;

    function handleSetAPICredentials(apiKey, apiSecret, password){
        const enctypredAPIKey = encryptData(password, apiKey);
        const enctypredAPISecret = encryptData(password, apiSecret);

        setapiKey(enctypredAPIKey);
        setapiSecret(enctypredAPISecret);

        localStorage.setItem(bybitAPIKeyStorageKey, enctypredAPIKey);
        localStorage.setItem(bybitAPISecretStorageKey, enctypredAPISecret);
        
        setPassKey(password);
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
    }

    function handleSetPassword(passkey){
        setPassKey(passkey);   
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
            setPassword: handleSetPassword
        }}>
            {children}
        </PlatformAPIContext.Provider>
    )
};