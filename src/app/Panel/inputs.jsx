'use client';

import React, { useEffect, useState } from 'react'
import Styles from "./tradePanel.module.css";
import LabeledField from "./labeledField";
import InputField from '@/lib/UIComponents/InputField';

const Inputs = React.forwardRef(function Inputs({onTickerChanged, ...params}, ref) {
    const [ticker, setTicker] = useState('BTCUSDT');
    const [capital, setCapital] = useState(100);
    const [targetRisk, setTargetRisk] = useState(1);
    const [leverage, setLeverage] = useState(20);
    const [entryPrice, setEntryPrice] = useState(0);
    const [stopLossPercent, setStopLossPersent] = useState(0.37);
    const [takeProfitRR, setTakeProfitRR] = useState(2);

    useEffect(() => {
        params.onChange?.();
    }, [ticker, capital, targetRisk, leverage, entryPrice, stopLossPercent, takeProfitRR]);

    React.useImperativeHandle(ref, () => ({
        /**
         * Retrieves the current input data for the trading parameters.
         * @returns {Object} An object containing the input data:
         * @property {number} capital - Total capital available for trading.
         * @property {number} targetRisk - Target risk percentage per trade.
         * @property {number} leverage - Leverage multiplier for the trade.
         * @property {string} ticker - Ticker symbol of the asset (e.g., "BTCUSDT").
         * @property {number} stopLossPercent - Percentage of price for stop loss.
         * @property {number} entryPrice - Entry price of the asset.
         */
        getInputData: () => {return {
            capital, 
            targetRisk, 
            leverage, 
            ticker,
            stopLossPercent, 
            entryPrice,
            takeProfitRR
        }},
    }));

    return (
        <div {...params}>
            <LabeledField label="Capital">
                <InputField type="number" value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="eg: 10000"/>
            </LabeledField>

            <LabeledField label="Capital risk, %">
                <InputField type="number" value={targetRisk} 
                onChange={(e) => {
                    if(e.target.value == undefined || e.target.value == ""){
                        setTargetRisk(e.target.value);
                        return;
                    }
                    setTargetRisk(Math.min(Math.max(e.target.value, 0), 100))
                }} 

                onBlur={(e) => {
                    if(e.target.value == undefined || e.target.value == ""){
                        setTargetRisk(0.01);
                    }
                }} 
                placeholder="eg: 1"/>
            </LabeledField>

            <LabeledField label="Leverage, x">
                <InputField type="number" value={leverage} onChange={(e) => setLeverage(e.target.value)} placeholder="eg: 20"/>
            </LabeledField>

            <hr/>

            <LabeledField label="Ticker">
                <InputField value={ticker} onChange={(e) => setTicker(e.target.value)} onBlur={(e) => onTickerChanged?.(e.target.value)} placeholder="eg: BTCUSDT"/>
            </LabeledField>
            <div className={Styles.historyButtonsArray}>
                <button className={Styles.historyButton} onClick={() => {setTicker("BTCUSDT"); onTickerChanged?.("BTCUSDT")}}>BTCUSDT</button>
                <button className={Styles.historyButton} onClick={() => {setTicker("BTCPERP"); onTickerChanged?.("BTCPERP")}}>BTCPERP</button>
                <button className={Styles.historyButton} onClick={() => {setTicker("ETHUSDT"); onTickerChanged?.("ETHUSDT")}}>ETHUSDT</button>
                <button className={Styles.historyButton} onClick={() => {setTicker("ETHPERP"); onTickerChanged?.("ETHPERP")}}>ETHPERP</button>
            </div>
            
            <LabeledField label="Entry price">
                <InputField type="number" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} placeholder="eg: 96000"/>
            </LabeledField>
                        
            <LabeledField label="Stop loss, %">
                <InputField type="number" value={stopLossPercent} onChange={(e) => setStopLossPersent(e.target.value)} placeholder="eg: 0.40"/>
            </LabeledField>
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
                                    
            <LabeledField label="Take profit, RR">
                <InputField type="number" value={takeProfitRR} onChange={(e) => setTakeProfitRR(e.target.value)} placeholder="eg: 2"/>
            </LabeledField>
        </div>
    )
});

export default Inputs;