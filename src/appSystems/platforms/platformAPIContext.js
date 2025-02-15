'use client';

import React, { useContext, useEffect, useState } from 'react'
import { PlatformsContext } from './PlatformsAPI/platformsContext';
import './PlatformsAPI/platformAPITypes';
import { AccountSelectedContext } from '../Accounts/accountSelectedContext';

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


export function PlatfomAPIContextProvider({ children }) {
    const accountSelectedContext = useContext(AccountSelectedContext);
    const platformsContext = useContext(PlatformsContext);

    const [platformAPI, setPlatformAPI] = useState();
    
    //const [_, setRedraw] = useReducer(s => s + 1, 0);
    const [isInitialized, setInitialized] = useState(false);

    // TODO: For some reason it resolves hydration issues
    useEffect(() => {
        setInitialized(true);
    }, []);

    useEffect(() => {
        if(accountSelectedContext.getAccountData()?.platformName == undefined){
            return;
        }

        const apiEndpoints = platformsContext.getPlatformEndpointsByName(accountSelectedContext.getAccountData()?.platformName);
        const accountData = accountSelectedContext.getAccountData();

        apiEndpoints.createClient(accountData.apiKey, accountData.apiSecret, accountData.isDemoAccount);
        setPlatformAPI(apiEndpoints);

        setInitialized(true);

    }, [accountSelectedContext, platformsContext]);

    if(!isInitialized)
        return;

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
        if(platformAPI == undefined){
            return {};
        }

        try {
            return await platformAPI?.getTickerInfo(ticker);
        } catch (error) {
            console.log(error);
        }
    }
    
    async function handleGetTickerPricing(ticker){
        if(platformAPI == undefined){
            return {};
        }

        try {
            return await platformAPI?.getTickerPricing(ticker);
        } catch (error) {
            console.log(error);
        }
    }

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