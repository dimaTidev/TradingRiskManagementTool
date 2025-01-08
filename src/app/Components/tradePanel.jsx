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

    async function submitLongOrder(){
        // const ticketPricing = await getTickerPrice(ticker);
        // TODO: if retreiving the ticker price is failed then show a red message!!!

        const assetPrice = roundNumber(Number.parseFloat(limitPrice), 1);//tickerCurrentPricing?.markPrice;

        const calcResult = calculateRiskOrder(capital, targetRisk, capInDealPercent, stopLossPercent, assetPrice, tickerInfo?.minOrderQty, tickerInfo?.qtyStep);

        console.log("calcResult", calcResult);

        const priceStopLossSwing = assetPrice * (stopLossPercent/100);

        console.log("priceStopLossSwing", priceStopLossSwing);
        

        const takeProfitPrice = roundNumber(assetPrice + priceStopLossSwing * 2, 1);
        const stopLossPrice = roundNumber(assetPrice - priceStopLossSwing, 1);

        console.log("takeProfitPrice", takeProfitPrice);
        console.log("stopLossPrice", stopLossPrice);
        
        const orderParams = {
            ticker: ticker,
            orderType: "Limit",
            assetVolume: calcResult.finalAssetVolume,
            leverage: calcResult.finalLeverage,
            orderPrice: assetPrice,
            takeProfitPrice: takeProfitPrice,
            stopLossPrice, stopLossPrice
        }

        platformAPIContext.placeLongOrder(orderParams);
    }

    async function submitShortOrder(){
        // TODO: change the price if we place the market order
        const assetPrice = roundNumber(Number.parseFloat(limitPrice), 1);//tickerCurrentPricing?.markPrice;

        const calcResult = calculateRiskOrder(capital, targetRisk, capInDealPercent, stopLossPercent, assetPrice, tickerInfo?.minOrderQty, tickerInfo?.qtyStep);

        console.log("calcResult", calcResult);

        const priceStopLossSwing = assetPrice * (stopLossPercent/100);

        console.log("priceStopLossSwing", priceStopLossSwing);
        
        const takeProfitPrice = roundNumber(assetPrice - priceStopLossSwing * 2, 1);
        const stopLossPrice = roundNumber(assetPrice + priceStopLossSwing, 1);

        console.log("takeProfitPrice", takeProfitPrice);
        console.log("stopLossPrice", stopLossPrice);
        
        const orderParams = {
            ticker: ticker,
            orderType: "Limit",
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
                <ButtonIcon src="next.svg" size={Size.L} onClick={() => setOpenSettings(true)}>Settings {openSettings}</ButtonIcon>
            </div>
 
            <hr/>
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
            <InputField type="number" defaultValue={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} label="Limit price"/>
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
                <ActionButton variant={Variant.Default} onClick={submitLongOrder}>Long</ActionButton>
                <ActionButton variant={Variant.Default} onClick={submitShortOrder}>Short</ActionButton>
            </div>

            {openSettings && <Settings onClose={() => setOpenSettings(false)} isAdvancedMode={isAdvancedMode} setAdvancedMode={setAdvancedMode}/>}
        </div>
    )
}

function Settings({onClose, onApply, isAdvancedMode, setAdvancedMode}) {
    const platformAPIContext = useContext(PlatformAPIContext);
    const [isAdvancedModeOption, setAdvancedModeOption] = useState(isAdvancedMode);

    const apiKeyRef = useRef();
    const apiSecretRef = useRef();
    const apiPasskeyRef = useRef();

    function handleApply(){
        const apiKey = apiKeyRef.current.value;
        const apiSecret= apiSecretRef.current.value;
        const passkey = apiPasskeyRef.current.value;

        console.log(apiKey, apiSecret, passkey);

        platformAPIContext.setAPICredentials(apiKey, apiSecret, passkey);
        setAdvancedMode(isAdvancedModeOption);
    
        onClose?.();
        onApply?.();
    }

  return (
    <div className={Styles.settingsOverlay}>
        <div className={Styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={Styles.header}>
                <a className={Styles.headerFont}>Settings</a>
                <ButtonIcon src="next.svg" size={Size.L} onClick={onClose}>X</ButtonIcon>
            </div>
            <hr/>

            {!platformAPIContext.CheckCredentialsSaved() ? <>
                <InputField ref={apiKeyRef} label="API key"/>
                <InputField ref={apiSecretRef} label="API secret"/>
                <InputField ref={apiPasskeyRef} label="Password"/>
            </> : <UnlockCredentialsField/>}

            {}

            <ToggleField checked={isAdvancedModeOption ? "checked" : ""} onChange={() => setAdvancedModeOption((s) => !s)} label="Advanced mode"/>

            <hr/>
            <div className={Styles.buttons}>
                <ActionButton variant={Variant.Default} onClick={handleApply}>Apply</ActionButton>
                <ActionButton variant={Variant.Default} onClick={onClose}>Cancel</ActionButton>
            </div>

        </div>
    </div>
  )
}

export function UnlockCredentialsField() {
    const platformAPIContext = useContext(PlatformAPIContext);
    
  return (
    <div className={Styles.unlockCredentialsField}>
        <InputField label="Enter password"/>
        <ActionButton onClick={() => platformAPIContext.deleteCredentials()}>Remove Credentials</ActionButton>
    </div>
  )
}


