"use client"

import React, { useContext, useEffect, useRef, useState } from 'react'
import Styles from "./tradePanel.module.css";
import InfoField from './infoField';
import InputField from './inputField';
import ActionButton, { Variant } from '@/lib/UIComponents/ActionButton';
import ButtonIcon, { Size } from '@/lib/UIComponents/ButtonIcon';
import ToggleField from './toggleField';
import { PlatformAPIContext } from './platformAPIContext';
import { calculateRiskOrder, roundNumber } from './tradeUtils';
import { getTickerPricing } from './PlatformsAPI/bybit';

export default function TradePanel() {
    const platformAPIContext = useContext(PlatformAPIContext);

    const [openSettings, setOpenSettings] = useState(false);
    const [isAdvancedMode, setAdvancedMode] = useState(false);

    // const [isLimitOrder, setLimitOrder] = useState(true);

    const [ticker, setTicker] = useState('BTCUSDT');
    const [tickerInfo, setTickerInfo] = useState({});
    const [tickerCurrentPricing, setTickerCurrentPricing] = useState(0);
    const [capital, setCapital] = useState(100);
    const [targetRisk, setTargetRisk] = useState(1);
    const [capInDealPercent, setCapInDealPersent] = useState(20);
    const [stopLossPercent, setStopLossPersent] = useState(0.37);
    const [limitPrice, setLimitPrice] = useState(0);

    useEffect(() => {
        if(!platformAPIContext.CheckCredentialsAndPasswordSaved())
            return;

        const tickerInfo = async () => {
            const responceTicker = await platformAPIContext.getTickerInfo(ticker);
            const responceTickerPrice = await platformAPIContext.getTickerPricing(ticker);

            setTickerInfo(responceTicker);
            setTickerCurrentPricing(responceTickerPrice);
            setLimitPrice(responceTickerPrice.markPrice);
        };
        tickerInfo();

    }, [ticker])
    
    const riskCapital = capital * (targetRisk / 100);
    const dealCapital = capital * (capInDealPercent / 100);

    // const leverage = roundNumber(Math.max(1, (riskCapital/(stopLossPercent/100))/capital/(capInDealPercent/100)));
    // const marginInDeal = roundNumber(riskCapital / (stopLossPercent / 100) / leverage);
    // const volume = roundNumber(marginInDeal * leverage);
    // const dealRisk = roundNumber(volume * (stopLossPercent / 100));

    const calcResult = calculateRiskOrder(capital, targetRisk, capInDealPercent, stopLossPercent, limitPrice, tickerInfo?.minOrderQty, tickerInfo?.qtyStep);

    const leverage = calcResult.finalLeverage;
    const marginInDeal = calcResult.finalMargin;
    const volume = calcResult.finalVolume;
    const assetVolume = calcResult.finalAssetVolume;
    const dealRisk = roundNumber(volume * (stopLossPercent / 100));
    // const dealRiskPersent = dealRisk/capital * 100;
    const dealRiskPersent = roundNumber((dealRisk/capital) * 100, 5);

    async function submitLongOrder(orderType){

        let assetPrice = roundNumber(Number.parseFloat(limitPrice), 1);//tickerCurrentPricing?.markPrice;

        if(orderType == "Market"){
            const res = await getTickerPricing(ticker);
            assetPrice = Number.parseFloat(res.markPrice);
        }
        // const ticketPricing = await getTickerPrice(ticker);
        // TODO: if retreiving the ticker price is failed then show a red message!!!

        const calcResult = calculateRiskOrder(capital, targetRisk, capInDealPercent, stopLossPercent, assetPrice, tickerInfo?.minOrderQty, tickerInfo?.qtyStep);

        console.log("calcResult", calcResult);

        const priceStopLossSwing = assetPrice * (stopLossPercent/100);

        console.log("priceStopLossSwing", priceStopLossSwing);
        

        const takeProfitPrice = roundNumber(assetPrice + priceStopLossSwing * 2, 1);
        const stopLossPrice = roundNumber(assetPrice - priceStopLossSwing, 1);

        console.log("assetPrice", assetPrice);
        console.log("takeProfitPrice", takeProfitPrice);
        console.log("stopLossPrice", stopLossPrice);
        
        const orderParams = {
            ticker: ticker,
            orderType: orderType,
            assetVolume: calcResult.finalAssetVolume,
            leverage: calcResult.finalLeverage,
            orderPrice: assetPrice,
            takeProfitPrice: takeProfitPrice,
            stopLossPrice, stopLossPrice
        }

        platformAPIContext.placeLongOrder(orderParams);
    }

    async function submitShortOrder(orderType){
        // TODO: change the price if we place the market order
        let assetPrice = roundNumber(Number.parseFloat(limitPrice), 1);//tickerCurrentPricing?.markPrice;

        if(orderType == "Market"){
            const res = await getTickerPricing(ticker);
            assetPrice = Number.parseFloat(res.markPrice);
        }

        const calcResult = calculateRiskOrder(capital, targetRisk, capInDealPercent, stopLossPercent, assetPrice, tickerInfo?.minOrderQty, tickerInfo?.qtyStep);

        console.log("calcResult", calcResult);

        const priceStopLossSwing = assetPrice * (stopLossPercent/100);

        console.log("priceStopLossSwing", priceStopLossSwing);
        
        const takeProfitPrice = roundNumber(assetPrice - priceStopLossSwing * 2, 1);
        const stopLossPrice = roundNumber(assetPrice + priceStopLossSwing, 1);

        console.log("assetPrice", assetPrice);
        console.log("takeProfitPrice", takeProfitPrice);
        console.log("stopLossPrice", stopLossPrice);
        
        const orderParams = {
            ticker: ticker,
            orderType: orderType,
            assetVolume: calcResult.finalAssetVolume,
            leverage: calcResult.finalLeverage,
            orderPrice: assetPrice,
            takeProfitPrice: takeProfitPrice,
            stopLossPrice, stopLossPrice
        }

        platformAPIContext.placeShortOrder(orderParams);
    }

    return (
        <div className={Styles.panel}>
            <div className={Styles.header}>
                <a className={Styles.headerFont}>Bybit</a>
                {platformAPIContext.isDemoTrading && <a className={Styles.warnText}>Demo trading</a>}
                {platformAPIContext.CheckCredentialsAndPasswordSaved() && <>
                    <ButtonIcon src="settings.svg" quiet={true} size={Size.L} onClick={() => setOpenSettings(true)}>Settings {openSettings}</ButtonIcon>
                    {openSettings && <Settings onClose={() => setOpenSettings(false)} isAdvancedMode={isAdvancedMode} setAdvancedMode={setAdvancedMode}/>}
                </>}
            </div>
            <hr/>

            {platformAPIContext.CheckCredentialsAndPasswordSaved() && <>
                <InputField type="number" value={capital} onChange={(e) => setCapital(e.target.value)} label="Capital"/>
                <InputField type="number" value={targetRisk} onChange={(e) => setTargetRisk(e.target.value)} label="Target Risk, %"/>
                <InfoField label="Risk capital" text={riskCapital.toString()}/>
                <hr/>
                <InputField type="number" value={capInDealPercent} onChange={(e) => setCapInDealPersent(e.target.value)} label="Margin, %"/>
                {/* <InfoField label="Margin" text={dealCapital.toString()}/> */}
                <hr/>
                <InputField defaultValue={ticker} onBlur={(e) => setTicker(e.target.value)} label="Ticker"/>
                {/* {tickerCurrentPricing?.markPrice && <InfoField label="Cur Price" text={`${tickerCurrentPricing?.markPrice} ${tickerInfo?.quoteCoin}`}/>} */}
                {isAdvancedMode && <>
                    {tickerInfo?.minOrderQty && <InfoField label="MinOrderQty" text={`${tickerInfo?.minOrderQty} ${tickerInfo?.baseCoin}`}/>}
                    {tickerInfo?.qtyStep && <InfoField label="qtyStep" text={`${tickerInfo?.qtyStep} ${tickerInfo?.baseCoin}`}/>}
                    {tickerInfo?.minLeverage && <InfoField label="minLeverage" text={`${tickerInfo?.minLeverage}x`}/>}
                    {tickerInfo?.maxLeverage && <InfoField label="maxLeverage" text={`${tickerInfo?.maxLeverage}x`}/>}
                </>}
                
                {tickerInfo && tickerInfo.errorMsg && <div>{tickerInfo.errorMsg}</div>}
                <hr/>
                <InputField type="number" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} label="Limit price"/>
                <ActionButton onClick={
                    async () => {
                        try {
                            const result = await getTickerPricing(ticker);
                            setLimitPrice(result.markPrice);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }>Last price</ActionButton>
                <InputField type="number" value={stopLossPercent} onChange={(e) => setStopLossPersent(e.target.value)} label="StopLoss, %"/>
                <hr/>
                <InfoField label="Leverage, x" text={leverage.toString()}/>
                <InfoField label="Volume" text={volume.toString()}/>
                
                <InfoField label="Asset Volume" text={`${assetVolume.toString()} ${tickerInfo?.baseCoin}`}/>
                
                <InfoField label="Margin" text={marginInDeal.toString()}/>
                <InfoField label="Risk %" text={`${dealRiskPersent.toString()}%`}/>

                {isAdvancedMode && <InfoField label="Risk" text={dealRisk.toString()}/>}

                <hr/>
                <div className={Styles.buttons}>
                    <ActionButton variant={Variant.Default} onClick={() => submitLongOrder("Limit")}>Long Limit</ActionButton>
                    <ActionButton variant={Variant.Default} onClick={() => submitShortOrder("Limit")}>Short Limit</ActionButton>
                </div>

                <hr/>
                <div className={Styles.buttons}>
                    <ActionButton variant={Variant.Default} onClick={() => submitLongOrder("Market")}>Long Market</ActionButton>
                    <ActionButton variant={Variant.Default} onClick={() => submitShortOrder("Market")}>Short Market</ActionButton>
                </div>
            </>}

            {!platformAPIContext.CheckCredentialsAndPasswordSaved() && <APICredentialsSettings/>}
        </div>
    )
}

function Settings({onClose, isAdvancedMode, setAdvancedMode}) {
  return (
    <div className={Styles.settingsOverlay}>
        <div className={Styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={Styles.header}>
                <a className={Styles.headerFont}>Settings</a>
                <ButtonIcon src="close.svg" quiet={true} size={Size.L} onClick={onClose}/>
            </div>
            <hr/>

            <ToggleField checked={isAdvancedMode ? "checked" : ""} onChange={() => setAdvancedMode((s) => !s)} label="Advanced mode"/>
    
            <APICredentialsSettingsRemoveButton onRemoveCredentials={() => onClose?.()}/>
        </div>
    </div>
  )
}

export function APICredentialsSettings() {
    const platformAPIContext = useContext(PlatformAPIContext);

    const [apiKey, setApiKey] = useState("");
    const [apiSecret, setApiSecret] = useState("");
    const [apiPass, setApiPass] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [demoTrading, setDemoTrading] = useState("");

    async function handleApply(){
        const responce = await platformAPIContext.setAPICredentials(apiKey, apiSecret, apiPass, demoTrading);
        setErrorMsg(responce.errorMsg);
    }

    return (
        <div className={Styles.credentialSettings}>
            {!platformAPIContext.CheckCredentialsSaved() ? <>
                <InputField value={apiKey} onChange={(e) => setApiKey(e.target.value)} label="API key"/>
                <InputField value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} label="API secret"/>
                <div className={Styles.helpText}>
                    Your API key and secret will be stored locally on your machine protected by a password. Make sure to remember the password. In the next page visit you will need to enter the password in order to decrypt the API key and secret. If you forget the password, no worries, reenter the API key and secret with a new password.
                </div>
                <ToggleField checked={demoTrading ? "checked" : ""} onChange={() => setDemoTrading((s) => !s)} label="Demo trading"/>
                {demoTrading && <div className={Styles.helpText}>
                    If you check demo trading on make sure you took the demo trading API key and secret! Otherwise you will see an error on authorization.
                </div>}
                <hr/>
                <InputField value={apiPass} onChange={(e) => setApiPass(e.target.value)} label="Password"/>
                <div className={Styles.helpText}>
                    Make up a password to encrypt your API key and secret. Later you will need to enter this password to decrypt your credentials
                </div>
                <hr/>
                <ActionButton variant={Variant.Default} onClick={handleApply}
                    disabled={apiKey == "" || apiSecret == "" || apiPass == "" ? "disabled" : ""}
                >Connect account</ActionButton>
            </> : <UnlockCredentialsField/>}
            {errorMsg && errorMsg != "" && <div className={Styles.errorText}>{errorMsg}</div>}
        </div>
    )
}

export function APICredentialsSettingsRemoveButton({onRemoveCredentials}) {
    const platformAPIContext = useContext(PlatformAPIContext);

  return (
        <div className={`${Styles.credentialSettings} ${Styles.dangerField}`} style={{flexDirection: "row", alignItems: "center"}}>
            Remove API key and secret 
            <ButtonIcon size={Size.L} src="delete.svg" onClick={() => {
                platformAPIContext.deleteCredentials();
                onRemoveCredentials?.();
            }}/>
        </div>
  )
}


export function UnlockCredentialsField() {
    const platformAPIContext = useContext(PlatformAPIContext);
    const [apiPass, setApiPass] = useState("");
    
  return (
    <>
        <div className={Styles.unlockCredentialsField}>
            <InputField onChange={(e) => setApiPass(e.target.value)} label="Enter password"/>
            <ButtonIcon size={Size.L} src="delete.svg" onClick={() => platformAPIContext.deleteCredentials()}/>
        </div>
        <div className={Styles.helpText}>
            Enter the password to decrypt your API key and Secret. If you forgot the password click the delete button.
        </div>
        <hr/>
        <ActionButton variant={Variant.Default} onClick={(e) => platformAPIContext.setPassword(apiPass)} disabled={apiPass == "" ? "disabled" : ""}>Decrypt</ActionButton>
    </>
  )
}


