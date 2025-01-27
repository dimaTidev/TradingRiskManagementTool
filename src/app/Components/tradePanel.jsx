"use client"

import React, { useContext, useEffect, useRef, useState } from 'react'
import Styles from "./tradePanel.module.css";
import InfoField from './infoField';
import InputField from './inputField';
import ActionButton from '@/lib/UIComponents/ActionButton';
import ButtonIcon from '@/lib/UIComponents/ButtonIcon';
import { Size, Variant } from '@/lib/UIComponents/uiCommon';
import ToggleField from './toggleField';
import { PlatformAPIContext } from './platformAPIContext';
import { calculateRiskOrder, roundNumber } from './tradeUtils';
import { getTickerPricing } from './PlatformsAPI/bybit';
import { APICredentialsSettings, APICredentialsSettingsRemoveButton } from '../Panel/creadentials/credentials';

export default function TradePanel() {
    const platformAPIContext = useContext(PlatformAPIContext);

    const [openSettings, setOpenSettings] = useState(false);
    const [isAdvancedMode, setAdvancedMode] = useState(false);

    // const [isLimitOrder, setLimitOrder] = useState(true);

    const [ticker, setTicker] = useState('');
    const [tickerInfo, setTickerInfo] = useState({});
    const [tickerCurrentPricing, setTickerCurrentPricing] = useState(0);
    const [capital, setCapital] = useState(100);
    const [targetRisk, setTargetRisk] = useState(1);
    const [capInDealPercent, setCapInDealPersent] = useState(20);
    const [stopLossPercent, setStopLossPersent] = useState(0.37);
    const [limitPrice, setLimitPrice] = useState(0);

    async function handleLoadTicker(ticker){
        if( ticker == undefined || ticker == ''){
            console.error("The ticker cannot be undefined or empty!");
            return;
        }

        const responceTicker = await platformAPIContext.getTickerInfo(ticker);
        const responceTickerPrice = await platformAPIContext.getTickerPricing(ticker);

        setTickerInfo(responceTicker);
        setTickerCurrentPricing(responceTickerPrice);
        setLimitPrice(responceTickerPrice.markPrice);
    }
    
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

    const disabledButtons = ticker == "" ? 'disabled' : "" || Number.parseFloat(stopLossPercent) < 0.05;
    let warningDisableMessage = "";

    if(ticker == ""){
        warningDisableMessage += "The ticker should be selected";
    }

    if(Number.parseFloat(stopLossPercent) < 0.05){
        warningDisableMessage += "\nStop loss percent should be more than 0.05";
    }

    return (
        <div className={Styles.panel}>
            <div className={Styles.header}>
                <a className={Styles.headerFont}>Bybit</a>
                <a className={Styles.warnText}>Demo trading</a>
                <>
                    <ButtonIcon src="settings.svg" quiet={true} size={Size.L} onClick={() => setOpenSettings(true)}>Settings {openSettings}</ButtonIcon>
                    {openSettings && <Settings onClose={() => setOpenSettings(false)} isAdvancedMode={isAdvancedMode} setAdvancedMode={setAdvancedMode}/>}
                </>
            </div>
            <hr/>

            <>
                <InputField type="number" value={capital} onChange={(e) => setCapital(e.target.value)} label="Capital"/>
                <InputField type="number" value={targetRisk} onChange={(e) => setTargetRisk(e.target.value)} label="Target Risk, %"/>
                <InfoField label="Risk capital" text={riskCapital.toString()}/>
                <hr/>
                <InputField type="number" value={capInDealPercent} onChange={(e) => setCapInDealPersent(e.target.value)} label="Margin, %"/>
                {/* <InfoField label="Margin" text={dealCapital.toString()}/> */}
                <hr/>
                <InputField value={ticker} onChange={(e) => setTicker(e.target.value)} onBlur={(e) => handleLoadTicker(e.target.value)} label="Ticker"/>
                <div className={Styles.historyButtonsArray}>
                    <button className={Styles.historyButton} onClick={() => {setTicker("BTCUSDT"); handleLoadTicker("BTCUSDT")}}>BTCUSDT</button>
                    <button className={Styles.historyButton} onClick={() => {setTicker("BTCPERP"); handleLoadTicker("BTCPERP")}}>BTCPERP</button>
                    <button className={Styles.historyButton} onClick={() => {setTicker("ETHUSDT"); handleLoadTicker("ETHUSDT")}}>ETHUSDT</button>
                    <button className={Styles.historyButton} onClick={() => {setTicker("ETHPERP"); handleLoadTicker("ETHPERP")}}>ETHPERP</button>
                </div>
                {/* {tickerCurrentPricing?.markPrice && <InfoField label="Cur Price" text={`${tickerCurrentPricing?.markPrice} ${tickerInfo?.quoteCoin}`}/>} */}
                {isAdvancedMode && <>
                    {tickerInfo?.minOrderQty && <InfoField label="MinOrderQty" text={`${tickerInfo?.minOrderQty} ${tickerInfo?.baseCoin}`}/>}
                    {tickerInfo?.qtyStep && <InfoField label="qtyStep" text={`${tickerInfo?.qtyStep} ${tickerInfo?.baseCoin}`}/>}
                    {tickerInfo?.minLeverage && <InfoField label="minLeverage" text={`${tickerInfo?.minLeverage}x`}/>}
                    {tickerInfo?.maxLeverage && <InfoField label="maxLeverage" text={`${tickerInfo?.maxLeverage}x`}/>}
                </>}
                
                {tickerInfo && tickerInfo.errorMsg && <div>{tickerInfo.errorMsg}</div>}
                <hr/>
                <div style={{display: "flex", flexDirection: "row", gap: "6px"}}>
                    <InputField type="number" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} label="Limit price"/>
                    <button className={Styles.historyButton} onClick={
                        async () => {
                            try {
                                const result = await getTickerPricing(ticker);
                                setLimitPrice(result.markPrice);
                            } catch (error) {
                                console.error(error);
                            }
                        }
                    }>Last price</button>
                </div>
                <InputField type="number" value={stopLossPercent} onChange={(e) => setStopLossPersent(e.target.value)} label="StopLoss, %"/>
                <div className={Styles.historyButtonsArray}>
                    <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.1)}>0.1</button>
                    <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.15)}>0.15</button>
                    <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.20)}>0.20</button>
                    <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.25)}>0.25</button>
                    <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.30)}>0.30</button>
                    <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.35)}>0.35</button>
                    <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.40)}>0.40</button>
                    <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.45)}>0.45</button>
                    <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.50)}>0.50</button>
                </div>
                <hr/>
                <InfoField label="Leverage, x" text={leverage.toString()}/>
                <InfoField label="Volume" text={volume.toString()}/>
                
                <InfoField label="Asset Volume" text={`${assetVolume.toString()} ${tickerInfo?.baseCoin}`}/>
                
                <InfoField label="Margin" text={marginInDeal.toString()}/>
                <InfoField label="Risk %" text={`${dealRiskPersent.toString()}%`}/>

                {isAdvancedMode && <InfoField label="Risk" text={dealRisk.toString()}/>}

                <hr/>
                <div className={Styles.buttons}>
                    <ActionButton variant={Variant.DEFAULT} onClick={() => submitLongOrder("Limit")} disabled={disabledButtons}>Long Limit</ActionButton>
                    <ActionButton variant={Variant.DEFAULT} onClick={() => submitShortOrder("Limit")} disabled={disabledButtons}>Short Limit</ActionButton>
                </div>

                <hr/>
                <div className={Styles.buttons}>
                    <ActionButton variant={Variant.DEFAULT} onClick={() => submitLongOrder("Market")} disabled={disabledButtons}>Long Market</ActionButton>
                    <ActionButton variant={Variant.DEFAULT} onClick={() => submitShortOrder("Market")} disabled={disabledButtons}>Short Market</ActionButton>
                </div>

                {disabledButtons && <div className={Styles.warnText}>{warningDisableMessage}</div>}
            </>

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