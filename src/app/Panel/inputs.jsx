'use client';

import React, { useEffect, useState } from 'react'
import Styles from "./tradePanel.module.css";
import LabeledField from "./labeledField";
import InputField from '@/lib/UIComponents/InputField';
import { roundNumber } from '../Components/tradeUtils';

const Inputs = React.forwardRef(function Inputs({onTickerChanged, checkValidTickerAsync, onValidInputs, ...params}, ref) {
    const [tickerControlled, setTickerControlled] = useState('BTCUSDT');

    const [ticker, setTicker] = useState('BTCUSDT');
    const [capital, setCapital] = useState(100);
    const [targetRisk, setTargetRisk] = useState(1);
    const [leverage, setLeverage] = useState(20);
    const [entryPrice, setEntryPrice] = useState(0);
    const [stopLossPercent, setStopLossPersent] = useState(0.37);
    const [takeProfitRR, setTakeProfitRR] = useState(2);
    const [isValidTicker, setIsValidTicker] = useState(false);

    function checkIsValidInputs(){
        if(capital == "" || capital <= 0 ||
            leverage == "" || 
            stopLossPercent == "" ||
            ticker == "" ||
            targetRisk == "" ||
            isValidTicker == false
        ){
            return false;
        }else{
            return true;
        }
    }

    useEffect(() => {
        params.onChange?.();

        if(checkIsValidInputs()){
            onValidInputs?.(false);
        }else{
            onValidInputs?.(true);
        }

    }, [ticker, capital, targetRisk, leverage, entryPrice, stopLossPercent, takeProfitRR, isValidTicker]);


    useEffect(() => {
        const checkValidTicker = async () => {
            try {
                params.onValid?.(false);
                const isValidTicker = await checkValidTickerAsync?.(ticker);

                console.log("is valid ticker await: ", isValidTicker);
                
                setIsValidTicker(isValidTicker);

                onTickerChanged?.(ticker);
            } catch (error) {
                console.error(error);
            }
        }
        
        checkValidTicker();
    }, [ticker]);

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

    const disabledTargetRisk = capital == "" || capital <= 0;
    const disabledLeverage = capital == "" || capital <= 0;
    const disabledEntryPrice = capital == "" || capital <= 0 || isValidTicker == false;
    const disabledStopLoss = capital == "" || capital <= 0 || isValidTicker == false;
    const disabledTakeProfit = capital == "" || capital <= 0 || isValidTicker == false;

    return (
        <div {...params}>
            <LabeledField label="Capital">
                <InputField type="number" value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="eg: 10000"/>
            </LabeledField>

            <LabeledField label="Capital risk, %" disabled = {disabledTargetRisk}>
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
                placeholder="eg: 1" 
                disabled = {disabledTargetRisk}
            />
            </LabeledField>

            <LabeledField label="Leverage, x" disabled={disabledLeverage}>
                <InputField type="number" value={leverage} onChange={(e) => {
                    if(e.target.value == undefined || e.target.value == ""){
                        setLeverage(e.target.value);
                        return;
                    }

                    setLeverage(roundNumber(Math.min(Math.max(e.target.value, 1), 100), 2));
                }} 
                
                onBlur={(e) => {
                    if(e.target.value == undefined || e.target.value == ""){
                        setLeverage(1);
                    }
                }} 
                
                placeholder="eg: 20" disabled={disabledLeverage}/>
            </LabeledField>

            <hr/>

            <LabeledField label="Ticker">
                <InputField 
                    value={tickerControlled} 
                    onChange={(e) => setTickerControlled(e.target.value)} 
                    onBlur={async (e) => {
                        setTicker(e.target.value);
                        // if(ticker == "")
                        //     return;

                        // try {
                        //     setIsValidTicker(false);
                        //     onValidInputs?.(false);
                        //     const isValidTicker = await checkValidTickerAsync?.(ticker);

                        //     console.log("is valid ticker await: ", isValidTicker);
                            
                        //     setIsValidTicker(isValidTicker);
                        // } catch (error) {
                        //     console.error(error);
                        // }
                        // onTickerChanged?.(e.target.value)
                    }} 
                    placeholder="eg: BTCUSDT"
                />
            </LabeledField>
            <div className={Styles.historyButtonsArray}>
                <button className={Styles.historyButton} onClick={() => {setTicker("BTCUSDT"); setTickerControlled("BTCUSDT")}}>BTCUSDT</button>
                <button className={Styles.historyButton} onClick={() => {setTicker("BTCPERP"); setTickerControlled("BTCPERP")}}>BTCPERP</button>
                <button className={Styles.historyButton} onClick={() => {setTicker("ETHUSDT"); setTickerControlled("ETHUSDT")}}>ETHUSDT</button>
                <button className={Styles.historyButton} onClick={() => {setTicker("ETHPERP"); setTickerControlled("ETHPERP")}}>ETHPERP</button>
            </div>
            
            <LabeledField label="Entry price" disabled={disabledEntryPrice}>
                <InputField type="number" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} placeholder="eg: 96000" disabled={disabledEntryPrice}/>
            </LabeledField>
                        
            <LabeledField label="Stop loss, %" disabled={disabledStopLoss}>
                <InputField type="number" value={stopLossPercent} onChange={(e) => setStopLossPersent(e.target.value)} placeholder="eg: 0.40" disabled={disabledStopLoss}/>
            </LabeledField>
            <div className={Styles.historyButtonsArray}>
                <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.1)} disabled={disabledStopLoss}>0.1</button>
                <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.15)} disabled={disabledStopLoss}>0.15</button>
                <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.20)} disabled={disabledStopLoss}>0.20</button>
                <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.25)} disabled={disabledStopLoss}>0.25</button>
                <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.30)} disabled={disabledStopLoss}>0.30</button>
                <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.35)} disabled={disabledStopLoss}>0.35</button>
                <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.40)} disabled={disabledStopLoss}>0.40</button>
                <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.45)} disabled={disabledStopLoss}>0.45</button>
                <button className={Styles.historyButton} onClick={() => setStopLossPersent(0.50)} disabled={disabledStopLoss}>0.50</button>
            </div>
                                    
            <LabeledField label="Take profit, RR" disabled={disabledTakeProfit}>
                <InputField type="number" value={takeProfitRR} onChange={(e) => setTakeProfitRR(e.target.value)} placeholder="eg: 2" disabled={disabledTakeProfit}/>
            </LabeledField>
        </div>
    )
});

export default Inputs;