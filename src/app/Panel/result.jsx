import React from 'react'
import Styles from "./calculator.module.css";
import { calculateRiskOrderSimple, calculateTakeProfitPrice, roundNumber } from "../Components/tradeUtils";

export default function Result({capital, targetRisk, leverage, stopLossPercent, entryPrice, className}) {

    // TODO: Put arguments minAssetQty, assetQtyStep!
    const results = calculateRiskOrderSimple(capital, targetRisk, leverage, stopLossPercent, entryPrice);

    return (
        <div className={className}>
            <div className={Styles.subInfoContainer}>
                <a>Ticker info</a>
                <hr/>
                <HorizontalInfo label="Ticker" value="value"/>
                <HorizontalInfo label="Max Leverage" value="value"/>
                <HorizontalInfo label="Min qty" value="value"/>
                <HorizontalInfo label="Qty step" value="value"/>
            </div>

            <div className={Styles.subInfoContainer}>
                <a>Calculation results</a>
                <hr/>
                <HorizontalInfo label="Leverage" value={results.leverage?.toString()}/>
                <HorizontalInfo label="Volume" value={results.volume?.toString()}/>
                <HorizontalInfo label="Asset vol" value={results.assetVolume?.toString()}/>
                <HorizontalInfo label="Margin" value={results.marginInDeal?.toString()}/>
                <HorizontalInfo label="Risk" value={roundNumber(results.volume * (stopLossPercent / 100))?.toString()}/>
                <HorizontalInfo label="Risk, %" value={(roundNumber(results.volume * (stopLossPercent / 100) / capital) * 100)?.toString()}/>
            </div>
        </div>
    )
}


function HorizontalInfo({ label, value }) {
    return (
        <div className={Styles.horizontalInfo}>
            <div className={Styles.horizontalLabel}>{label}</div>
            <div className={Styles.horizontalValue}>{value}</div>
        </div>
    )
}
