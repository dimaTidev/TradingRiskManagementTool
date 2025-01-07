"use client"

import React, { useEffect, useState } from 'react'
import Styles from "./tradePanel.module.css";
import InfoField from './infoField';
import InputField from './inputField';
import { getTickerInfo, getTickerPricing, submitOrder } from './PlatformsAPI/bybit';

function roundNumber(number, decimals = 2){
    const decimV = 10**decimals;
    return Math.round(number  * decimV) / decimV;
}

function calculateRiskOrder(capital, targetRisk, capInDealPercent, stopLossPercent, price, minAssetQty, assetQtyStep){
    const riskCapital = capital * (targetRisk / 100);
    // const dealCapital = capital * (capInDealPercent / 100);

    const leverage = roundNumber(Math.max(1, (riskCapital/(stopLossPercent/100))/capital/(capInDealPercent/100)));
    const marginInDeal = roundNumber(riskCapital / (stopLossPercent / 100) / leverage);
    const volume = roundNumber(marginInDeal * leverage);
    // const dealRisk = roundNumber(volume * (stopLossPercent / 100));

    const minVolume = minAssetQty * price;
    const volumeStep = assetQtyStep * price;
    const roundedCount = Math.max(0, Math.ceil((volume - minVolume) / volumeStep));
    const finalVolume = roundNumber(minVolume + volumeStep * roundedCount);
    const finalLeverage = roundNumber(Math.max(1, finalVolume / marginInDeal));
    const finalMargin = roundNumber(finalVolume / finalLeverage);
    const finalAssetVolume = (minVolume + volumeStep * roundedCount) / price;

    console.log("minAssetQty", minAssetQty);
    console.log("assetQtyStep", assetQtyStep);
    console.log("price", price);
    

    return{
        leverage,
        volume,
        marginInDeal,

        finalLeverage,
        finalVolume,
        finalAssetVolume,
        finalMargin
    }
}

export default function TradePanel() {
    const [openSettings, setOpenSettings] = useState(false);

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
            const responceTicker = await getTickerInfo(ticker);
            const responceTickerPrice = await getTickerPricing(ticker);

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

    console.log("calcResult", calcResult);

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
        
        submitOrder(ticker, "Long", "Limit", calcResult.finalAssetVolume, calcResult.finalLeverage, assetPrice, takeProfitPrice, stopLossPrice);
        // submitOrder(ticker, "Long", "Limit", calcResult.finalAssetVolume, 6, assetPrice, takeProfitPrice, stopLossPrice);
    }

    return (
        <div className={Styles.panel}>
            <div className={Styles.header}>
                <a className={Styles.headerFont}>Bybit</a>
                <button onClick={() => setOpenSettings((s) => !s)}>Settings {openSettings}</button>
            </div>

            <hr/>
            <InputField value={capital} onChange={(e) => setCapital(e.target.value)} label="Capital"/>
            <InputField value={targetRisk} onChange={(e) => setTargetRisk(e.target.value)} label="Target Risk, %"/>
            <InfoField label="Risk capital" text={riskCapital.toString()}/>
            <hr/>
            <InputField value={capInDealPercent} onChange={(e) => setCapInDealPersent(e.target.value)} label="Margin, %"/>
            <InfoField label="Margin" text={dealCapital.toString()}/>
            <hr/>
            <InputField defaultValue={ticker} onBlur={(e) => setTicker(e.target.value)} label="Ticker"/>
            <InputField defaultValue={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} label="Limit price"/>
            {/* {tickerCurrentPricing?.markPrice && <InfoField label="Cur Price" text={`${tickerCurrentPricing?.markPrice} ${tickerInfo?.quoteCoin}`}/>} */}
            {tickerInfo?.minOrderQty && <InfoField label="MinOrderQty" text={`${tickerInfo?.minOrderQty} ${tickerInfo?.baseCoin}`}/>}
            {tickerInfo?.qtyStep && <InfoField label="qtyStep" text={`${tickerInfo?.qtyStep} ${tickerInfo?.baseCoin}`}/>}
            {tickerInfo?.minLeverage && <InfoField label="minLeverage" text={`${tickerInfo?.minLeverage}x`}/>}
            {tickerInfo?.maxLeverage && <InfoField label="maxLeverage" text={`${tickerInfo?.maxLeverage}x`}/>}
            {/* <div>{tickerInfo?.errorMsg}</div> */}
            {tickerInfo && tickerInfo.errorMsg && <div>{tickerInfo.errorMsg}</div>}
            <hr/>
            <InputField value={stopLossPercent} onChange={(e) => setStopLossPersent(e.target.value)} label="StopLoss, %"/>
            <hr/>
            <InfoField label="Margin/Deal" text={marginInDeal.toString()}/>
            <InfoField label="Leverage, x" text={leverage.toString()}/>
            <InfoField label="Volume" text={volume.toString()}/>
            <InfoField label="Asset Volume" text={`${assetVolume.toString()} ${tickerInfo?.baseCoin}`}/>
            <InfoField label="Risk" text={dealRisk.toString()}/>
            <InfoField label="Risk %" text={`${dealRiskPersent.toString()}%`}/>

            <hr/>
            <div className={Styles.buttons}>
                <button onClick={submitLongOrder}>Buy <br/> Long</button>
                <button>Sell <br/> Short</button>
            </div>

            {openSettings && (
                <div className={Styles.settingsOverlay}>openSettings</div>
            )}
        </div>
    )
}
