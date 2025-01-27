'use client';

import React, { useContext, useEffect, useState } from 'react'
import { PlatformsContext } from './PlatformsAPI/platformsContext';
import { AccountSelectedContext } from '../Panel/Accounts/accountSelectedContext';
import './PlatformsAPI/platformAPITypes';

// Create a context and use it within the component
export const PlatformAPIContext = React.createContext({
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
});

//useContext(PlatformAPIContext);

export function BybitPlatfomAPIContextProvider({ children }) {
    const accountSelectedContext = useContext(AccountSelectedContext);
    const platformsContext = useContext(PlatformsContext);

    const [platformAPI, setPlatformAPI] = useState(platformsContext.getPlatformEndpointsByName("bybit"));
    
    //const [_, setRedraw] = useReducer(s => s + 1, 0);
    const [isInitialized, setInitialized] = useState(false);

    // TODO: why it is here?
    // useEffect(() => {
    //     platformAPI.getTickerPricing();
    // }, [platformAPI]);

    // For some reason it resolves hydration issues
    // useEffect(() => {
    //     setInitialized(true);
    // }, []);

    // TODO: complete changing the platform
    // TODO: we probably need to rethink how we process the password. Compare with a hash of the password, not API call!
    useEffect(() => {
        if(accountSelectedContext.getAccountData()?.platformName == undefined){
            return;
        }

        const apiEndpoints = platformsContext.getPlatformEndpointsByName(accountSelectedContext.getAccountData()?.platformName);
        const accountData = accountSelectedContext.getAccountData();

        apiEndpoints.createClient(accountData.apiKey, accountData.apiSecret, accountData.isDemoAccount);
        setPlatformAPI(apiEndpoints);

        // console.log("Setting up the api:", accountData.apiKey, accountData.apiSecret, accountData.isDemoAccount);
        setInitialized(true);

    }, [accountSelectedContext, platformsContext]);

    if(!isInitialized)
        return;

    // useEffect(() => {
    //     setInitialized(false);

    //     if(platformAPI == undefined){
    //         return;
    //     }

    //     const logIn = async () => {
    //         try {
    //             const apiKey = localStorage.getItem(bybitAPIKeyStorageKey);
    //             const apiSecret = localStorage.getItem(bybitAPISecretStorageKey);
    //             const passKey = decryptData("passkey", sessionStorage.getItem(bybitAPIPassKey));
    //             const demoTrading = localStorage.getItem("demoTrading");

    //             const responce = await checkPassword(apiKey, apiSecret, passKey, demoTrading);
    //             if(responce != undefined){
    //                 setPassKey(undefined);
    //             }else{
    //                 setapiKey(apiKey);
    //                 setapiSecret(apiSecret);
    //                 setDemoTrading(demoTrading);
    //             }

    //         } catch (error) {
    //             console.error(error);
    //         }

    //         setInitialized(true);
    //     }
        
    //     logIn();
        
    // }, [platformAPI]);

    // if(!isInitialized)
    //     return;

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

        // TODO: add error message handling!
        try {
            const result = await platformAPI?.submitOrder(
                params.ticker,
                "Short",
                params.orderType,
                params.assetVolume,
                params.leverage,
                params.orderPrice,
                params.takeProfitPrice,
                params.stopLossPrice
            );

            return result;
        } catch (error) {
            console.log(error);
        }

        return {
            isError: true,
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

        // TODO: add error message handling!
        try {
            const result = await platformAPI?.submitOrder(
                params.ticker,
                "Long",
                params.orderType,
                params.assetVolume,
                params.leverage,
                params.orderPrice,
                params.takeProfitPrice,
                params.stopLossPrice
            );

            return result;
        } catch (error) {
            console.log(error);
        }

        return {
            isError: true,
        }
    }

    async function handleGetTickerInfo(ticker){
        try {
            return await platformAPI?.getTickerInfo(ticker);
        } catch (error) {
            console.log(error);
        }
    }
    
    async function handleGetTickerPricing(ticker){
        try {
            return await platformAPI?.getTickerPricing(ticker);
        } catch (error) {
            console.log(error);
        }
    }

    // async function checkPassword(apiKey, apiSecret, passkey, demoTrading){
    //     console.log("checkPassword", passkey, demoTrading);
    //     // Check the pass key
    //     if(passkey == undefined || passkey == ""){
    //         // TODO: throw an error message
    //         return;
    //     }

    //     // Check the saved credentials!
    //     if(apiKey == undefined || apiKey == "" || apiSecret == undefined || apiSecret == ""){
    //         // TODO: throw an error message
    //         return;
    //     }

    //     // decryptData credentials

    //     let decodedApiKey;
    //     let decodedApiSecret;

    //     try {
    //         decodedApiKey = decryptData(passkey, apiKey);
    //         decodedApiSecret = decryptData(passkey, apiSecret);
    //     } catch (error) {
    //         return "Decryption failure"
    //     }

    //     // Try to create a client
    //     await platformAPI?.createClient(decodedApiKey, decodedApiSecret, demoTrading);

    //     console.log("decodedApiKey", decodedApiKey);
    //     console.log("decodedApiSecret", decodedApiSecret);
    //     console.log("demoTrading", demoTrading);
        
    //     // Verify credentials
    //     const responce = await platformAPI?.getAccountInfo();

    //     console.log("responce", responce);

    //     if(responce.retCode == 0 && responce.retMsg == "OK"){
    //         console.log("Success"); 
    //         sessionStorage.setItem(bybitAPIPassKey, encryptData("passkey", passkey));
    //         setPassKey(passkey);
    //     }else{
    //         console.log("Failure");
    //         console.log("responce.retMsg", responce.retMsg);
    //         return responce.retMsg;
    //     }

    //     return undefined;
    // }

    return (
        <PlatformAPIContext.Provider value={{
            placeShortOrder: handlePlaceShortOrder,
            placeLongOrder: handlePlaceLongOrder,
            getTickerInfo: handleGetTickerInfo,
            getTickerPricing: handleGetTickerPricing,
        }}>
            {children}
        </PlatformAPIContext.Provider>
    )
};



export function TestPlatfomAPIContextProvider({ children }) {
    return (
        <PlatformAPIContext.Provider value={{
            placeShortOrder: (params) => console.log("placeShortOrder", params),
            placeLongOrder: (params) => console.log("placeLongOrder", params),
            getTickerInfo: (params) => console.log("getTickerInfo", params),
            getTickerPricing: (params) => console.log("getTickerPricing", params),
        }}>
            {children}
        </PlatformAPIContext.Provider>
    )
}