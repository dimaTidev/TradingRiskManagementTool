'use client';

import React, { useEffect, useState } from 'react'
import Styles from "./inputs.module.css";
import LabeledField from "./labeledField";
import InputField from '@/lib/UIComponents/InputField';
import { roundNumber } from '../Components/tradeUtils';
import Button from '@/lib/UIComponents/Button';
import { Size, Variant } from '@/lib/UIComponents/uiCommon';

const Inputs = React.forwardRef(function Inputs({onTickerChanged, checkValidTickerAsync, onValidInputs, checkTickerPriceAsync, defaultValues, ...params}, ref) {
    defaultValues ??= {};

    const [tickerControlled, setTickerControlled] = useState(defaultValues.ticker ? defaultValues.ticker : "");
    const [ticker, setTicker] = useState(defaultValues.ticker ? defaultValues.ticker : "");

    const [capital, setCapital] = useState(defaultValues.capital ? defaultValues.capital : "");
    const [targetRiskPers, setTargetRiskPers] = useState(defaultValues.targetRisk ? defaultValues.targetRisk : 1);
    const [targetRiskValue, setTargetRiskValue] = useState("");
    const [leverage, setLeverage] = useState(defaultValues.leverage ? defaultValues.leverage : 10);
    const [entryPrice, setEntryPrice] = useState(defaultValues.entryPrice ? defaultValues.entryPrice : "");
    const [stopLossPercent, setStopLossPersent] = useState(defaultValues.stopLossPercent ? defaultValues.stopLossPercent : 0.3);
    const [takeProfitRR, setTakeProfitRR] = useState(defaultValues.takeProfitRR ? defaultValues.takeProfitRR : 2);
    const [isValidTicker, setIsValidTicker] = useState(false);

    function checkIsValidInputs(){
        if(capital == "" || capital <= 0 ||
            leverage == "" || 
            stopLossPercent == "" ||
            ticker == "" ||
            targetRiskPers == "" ||
            isValidTicker == false
        ){
            return false;
        }else{
            return true;
        }
    }

    useEffect(() => {
        setTargetRiskValue(capital * (targetRiskPers / 100));
    }, []);

    useEffect(() => {
        params.onChange?.();

        if(checkIsValidInputs()){
            onValidInputs?.(true);
        }else{
            onValidInputs?.(false);
        }

    }, [ticker, capital, targetRiskPers, leverage, entryPrice, stopLossPercent, takeProfitRR, isValidTicker]);


    useEffect(() => {
        const checkValidTicker = async () => {
            try {
                params.onValid?.(false);

                if(ticker != undefined && ticker != ""){
                    const isValidTicker = await checkValidTickerAsync?.(ticker);

                    setIsValidTicker(isValidTicker);
                }

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
            targetRisk: targetRiskPers, 
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
            <div className={Styles.horizontalInputs}>
                <LabeledField label="Capital">
                    <InputField type="number" value={capital} onChange={(e) => {
                            setCapital(e.target.value);

                            if(e.target.value == ""){
                                setTargetRiskValue(0);
                            }else{
                                const inputValue = Number.parseFloat(e.target.value);
                                const value = inputValue * (targetRiskPers / 100);
                                setTargetRiskValue(roundNumber(value, 3));
                            }
                        }} 
                        placeholder="eg: 10000"
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
            </div>

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
                <div className={Styles.historyButtonsArray}>
                    <button className={Styles.historyButton} onClick={() => {setTicker("BTCUSDT"); setTickerControlled("BTCUSDT")}}>BTCUSDT</button>
                    <button className={Styles.historyButton} onClick={() => {setTicker("BTCPERP"); setTickerControlled("BTCPERP")}}>BTCPERP</button>
                    <button className={Styles.historyButton} onClick={() => {setTicker("ETHUSDT"); setTickerControlled("ETHUSDT")}}>ETHUSDT</button>
                    <button className={Styles.historyButton} onClick={() => {setTicker("ETHPERP"); setTickerControlled("ETHPERP")}}>ETHPERP</button>
                </div>
            </LabeledField>
            

            <hr/>

            <div className={Styles.horizontalInputs}>
                <LabeledField label="Target risk" disabled = {disabledTargetRisk}>
                    <InputField type="number" value={targetRiskValue} 
                    onChange={(e) => {
                        if(e.target.value == undefined || e.target.value == ""){
                            setTargetRiskValue(e.target.value);
                            return;
                        }

                        const inputValue = Number.parseFloat(e.target.value);
                        const value = Math.min(Math.max(inputValue, 1), 100);
                        const valuePers = roundNumber((value / capital) * 100, 2);

                        setTargetRiskPers(valuePers);
                        setTargetRiskValue(roundNumber(value, 3));      
                    }} 

                    onBlur={(e) => {
                        if(e.target.value == undefined || e.target.value == ""){
                            const valuePers = 0.01;
                            const value = capital * (valuePers / 100);
                            setTargetRiskPers(valuePers);
                            setTargetRiskValue(roundNumber(value, 3));
                        }
                    }} 
                    placeholder="eg: 1" 
                    disabled = {disabledTargetRisk}
                />
                </LabeledField>

                <LabeledField label="%" disabled = {disabledTargetRisk}>
                    <InputField 
                        type="number" 
                        value={targetRiskPers} 
                        step="0.25"
                        onChange={(e) => {
                            if(e.target.value == undefined || e.target.value == ""){
                                setTargetRiskPers(e.target.value);
                                return;
                            }

                            const inputValue = Number.parseFloat(e.target.value);
                            const valuePers = Math.min(Math.max(inputValue, 0.01), 100);
                            const value = capital * (valuePers / 100);

                            setTargetRiskPers(valuePers);
                            setTargetRiskValue(roundNumber(value, 3));
                        }} 

                        onBlur={(e) => {
                            if(e.target.value == undefined || e.target.value == ""){
                                const valuePers = 0.01;
                                const value = capital * (valuePers / 100);
                                setTargetRiskPers(valuePers);
                                setTargetRiskValue(roundNumber(value, 3));
                            }
                        }} 
                        placeholder="eg: 1" 
                        disabled = {disabledTargetRisk}
                    />
                </LabeledField>
            </div>
            
            <div className={Styles.horizontalInputs}>
                <LabeledField label="Entry price" disabled={disabledEntryPrice}>
                    <InputField type="number" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} placeholder="eg: 96000" disabled={disabledEntryPrice}>
                        <Button variant={Variant.DEFAULT} size={Size.XS} quiet={true} onClick={async (e) => {
                            const price = await checkTickerPriceAsync?.(ticker);
                            if(price != undefined && price != "" && Number.parseFloat(price) > 0){
                                setEntryPrice(price);
                            }
                            
                        }} disabled={disabledEntryPrice}>Last price</Button>
                    </InputField>
                </LabeledField>
                
            </div>

                        
            <LabeledField label="Stop loss, %" disabled={disabledStopLoss}>
                <InputField type="number" value={stopLossPercent} step="0.05" onChange={(e) => setStopLossPersent(e.target.value)} placeholder="eg: 0.40" disabled={disabledStopLoss}/>
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
            </LabeledField>
                                    
            <LabeledField label="Take profit, RR" disabled={disabledTakeProfit}>
                <InputField type="number" value={takeProfitRR} step="0.5" onChange={(e) => setTakeProfitRR(e.target.value)} placeholder="eg: 2" disabled={disabledTakeProfit}/>
            </LabeledField>
        </div>
    )
});

export default Inputs;