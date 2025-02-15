'use client';

import React from 'react';
import * as BybitAPI from './bybit';
import * as Types from "./platformAPITypes.js"

const platforms = new Map();
platforms.set("bybit", BybitAPI);

const platformNames = [];
platforms.forEach((value, key) => platformNames.push(key)); 

// console.log("platforms", platforms);
// console.log("platformNames", platformNames);

export const PlatformsContext = React.createContext({
    
    /** 
     * @param {string} platformName
     * @return {Types.PlatformAPI}
     */
    getPlatformEndpointsByName(platformName){},
    platformNames: [""],
});


export function PlatformsContextProvider({ children }) {

    /** 
     * @param {string} platformName
     * @return {Types.PlatformAPI} 
     */
    function getPlatformEndpointsByName(platformName){
        return platforms.get(platformName);
    }

    return (
        <PlatformsContext.Provider value={{
            getPlatformEndpointsByName,
            platformNames: [...platformNames]
        }}>
            {children}
        </PlatformsContext.Provider>
    )
};