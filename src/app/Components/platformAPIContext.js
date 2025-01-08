'use client';

import React, { useEffect, useState } from 'react'
import { createClient, getTickerInfo, getTickerPricing, submitOrder } from './PlatformsAPI/bybit';

// Create a context and use it within the component
export const PlatformAPIContext = React.createContext({
    setAPICredentials(apiKey, apiSecret, password){},
    placeShortOrder(params){},
    placeLongOrder(params){},
    getTickerInfo(ticker){}, 
    getTickerPricing(ticker){},
});

//useContext(PlatformAPIContext);

export function PlatformAPIContextProvider({ children }) {
    //const [_, setRedraw] = useReducer(s => s + 1, 0);
    const [isInitialized, setInitialized] = useState(false);
    const [apiKey, setapiKey] = useState(process.env.NEXT_PUBLIC_API_KEY);
    const [apiSecret, setapiSecret] = useState(process.env.NEXT_PUBLIC_API_SECRET);

    useEffect(() => {
        console.log("create client");

        setInitialized(false);
        const createCl = async () => {
            await createClient(apiKey, apiSecret);
            setInitialized(true);
        }
        
        createCl();
        
    }, [apiKey, apiSecret]);

    if(!isInitialized)
        return;

    function handleSetAPICredentials(apiKey, apiSecret, password){
        // TODO: encode API credentials!!!
        setapiKey(apiKey);
        setapiSecret(apiSecret);
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
    function handlePlaceShortOrder(params){
        console.log("place short order");
        // TODO: add error message handling!
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
    function handlePlaceLongOrder(params){
        console.log("place long order");
        // TODO: add error message handling!
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
    }

    async function handleGetTickerInfo(ticker){
        return await getTickerInfo(ticker);
    }
    
    async function handleGetTickerPricing(ticker){
        return await getTickerPricing(ticker);
    }

    return (
        <PlatformAPIContext.Provider value={{
            setAPICredentials: handleSetAPICredentials,
            placeShortOrder: handlePlaceShortOrder,
            placeLongOrder: handlePlaceLongOrder,
            getTickerInfo: handleGetTickerInfo,
            getTickerPricing: handleGetTickerPricing,
        }}>
            {children}
        </PlatformAPIContext.Provider>
    )
};