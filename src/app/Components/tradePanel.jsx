"use client"

import React, { useState } from 'react'
import Styles from "./tradePanel.module.css";
import InfoField from './infoField';
import InputField from './inputField';

function roundNumber(number, decimals = 2){
    const decimV = 10**decimals;
    return Math.round(number  * decimV) / decimV;
}

export default function TradePanel() {
    const [capital, setCapital] = useState(100);
    const [targetRisk, setTargetRisk] = useState(1);
    const [capInDealPercent, setCapInDealPersent] = useState(20);
    const [stopLossPercent, setStopLossPersent] = useState(0.37);

    const riskCapital = capital * (targetRisk / 100);
    const dealCapital = capital * (capInDealPercent / 100);

    const leverage = roundNumber(Math.max(1, (riskCapital/(stopLossPercent/100))/capital/(capInDealPercent/100)));
    const marginInDeal = roundNumber(riskCapital / (stopLossPercent / 100) / leverage);
    const volume = roundNumber(marginInDeal * leverage);
    const dealRisk = roundNumber(volume * (stopLossPercent / 100));

    return (
        <div className={Styles.panel}>
            <div className={Styles.header}>
                <a className={Styles.headerFont}>Bybit</a>
                <button>Settings</button>
            </div>

            <hr/>
            <InputField value={capital} onChange={(e) => setCapital(e.target.value)} label="Capital"/>
            <InputField value={targetRisk} onChange={(e) => setTargetRisk(e.target.value)} label="Target Risk, %"/>
            <InfoField label="Risk capital" text={riskCapital.toString()}/>
            <hr/>
            <InputField value={capInDealPercent} onChange={(e) => setCapInDealPersent(e.target.value)} label="Capital/Deal, %"/>
            <InfoField label="Deal capital" text={dealCapital.toString()}/>
            <hr/>
            <InputField value={stopLossPercent} onChange={(e) => setStopLossPersent(e.target.value)} label="StopLoss, %"/>
            <hr/>
            <InfoField label="Margin/Deal" text={marginInDeal.toString()}/>
            <InfoField label="Leverage, x" text={leverage.toString()}/>
            <InfoField label="Volume" text={volume.toString()}/>
            <InfoField label="Risk" text={dealRisk.toString()}/>

            <hr/>
            <div className={Styles.buttons}>
                <button>Buy <br/> Long</button>
                <button>Sell <br/> Short</button>
            </div>
        </div>
    )
}
