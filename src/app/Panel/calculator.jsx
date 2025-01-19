import InputField from "@/lib/UIComponents/InputField";
import Styles from "./calculator.module.css";
import React, { useState } from 'react'
import LabeledField from "./labeledField";
import { calculateRiskOrderSimple, calculateTakeProfitPrice, roundNumber } from "../Components/tradeUtils";

// export const WorflowEditor = React.forwardRef(function WorflowEditor({style, workflowJson}, ref) {

//     React.useImperativeHandle(ref, () => ({
//         getWorkflowJson: () => workflowContextRef.current?.getWorkflowJson(),
//         setWorkflowJson,
//     }));
// });

const Calculator = React.forwardRef(function Calculator(params, ref)  {
    const [ticker, setTicker] = useState('BTCUSDT');
    const [capital, setCapital] = useState(100);
    const [targetRisk, setTargetRisk] = useState(1);
    const [leverage, setLeverage] = useState(20);
    const [entryPrice, setEntryPrice] = useState(0);
    const [stopLossPercent, setStopLossPersent] = useState(0.37);
    const [takeProfitRR, setTakeProfitRR] = useState(2);

    // const [tickerInfo, setTickerInfo] = useState({});
    // const [tickerCurrentPricing, setTickerCurrentPricing] = useState(0);

    React.useImperativeHandle(ref, () => ({
        getInputData: () => {

            // TODO: Put arguments minAssetQty, assetQtyStep!
            const calculationsResult = calculateRiskOrderSimple(capital, targetRisk, leverage, stopLossPercent, entryPrice);

            // TODO: take into account the position direction (short or long)!!!
            const takeProfitPrice = calculateTakeProfitPrice();

            return{
                ticker: ticker,
                leverage: leverage,
                orderPrice: entryPrice,
                assetVolume: calculationsResult.assetVolume,
                takeProfitPrice: takeProfitPrice,
                stopLossPrice: calculationsResult.stopLossPrice
            }
        },

        // TODO: implement these functions in order to know the direction for SL and TP
        getShortData: () => {
            // TODO: the price can vary from Limit and Market orders
            const price = entryPrice;

            // TODO: Put arguments minAssetQty, assetQtyStep!
            const calculationsResult = calculateRiskOrderSimple(capital, targetRisk, leverage, stopLossPercent, price);

            // TODO: take into account the position direction (short or long)!!!
            const takeProfitPrice = calculateTakeProfitPrice(price, stopLossPercent, takeProfitRR, "Short");

            return{
                ticker: ticker,
                leverage: leverage,
                orderPrice: entryPrice,
                assetVolume: calculationsResult.assetVolume,
                takeProfitPrice: takeProfitPrice,
                stopLossPrice: calculationsResult.stopLossPrice
            }
        },

        getLongData: () => {
            // TODO: complete the same code from Short for Long 
        },
    }));

    // TODO: Put arguments minAssetQty, assetQtyStep!
    const results = calculateRiskOrderSimple(capital, targetRisk, leverage, stopLossPercent, entryPrice);

    return (
        <div className={Styles.base}>
            <div className={Styles.leftSide}>
                <LabeledField label="Capital">
                    <InputField value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="eg: 10000"/>
                </LabeledField>

                <LabeledField label="Risk, %">
                    <InputField value={targetRisk} onChange={(e) => setTargetRisk(e.target.value)} placeholder="eg: 1"/>
                </LabeledField>

                <LabeledField label="Leverage, x">
                    <InputField value={leverage} onChange={(e) => setLeverage(e.target.value)} placeholder="eg: 20"/>
                </LabeledField>

                <hr/>

                <LabeledField label="Ticker">
                    <InputField value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="eg: BTCUSDT"/>
                </LabeledField>
                
                <LabeledField label="Entry price">
                    <InputField value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} placeholder="eg: 96000"/>
                </LabeledField>
                            
                <LabeledField label="Stop loss, %">
                    <InputField value={stopLossPercent} onChange={(e) => setStopLossPersent(e.target.value)} placeholder="eg: 0.40"/>
                </LabeledField>
                                        
                <LabeledField label="Take profit, RR">
                    <InputField value={takeProfitRR} onChange={(e) => setTakeProfitRR(e.target.value)} placeholder="eg: 2"/>
                </LabeledField>
            </div>


            <div className={Styles.rightSide}>
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
                        <HorizontalInfo label="Leverage" value={results.leverage}/>
                        <HorizontalInfo label="Volume" value={results.volume}/>
                        <HorizontalInfo label="Asset vol" value={results.assetVolume}/>
                        <HorizontalInfo label="Margin" value={results.marginInDeal}/>
                        <HorizontalInfo label="Risk" value={roundNumber(results.volume * (stopLossPercent / 100))}/>
                        <HorizontalInfo label="Risk, %" value={roundNumber(results.volume * (stopLossPercent / 100) / capital) * 100}/>
                </div>
            </div>
        </div>
    )
});


function HorizontalInfo({ label, value }) {
  return (
    <div className={Styles.horizontalInfo}>
        <div className={Styles.horizontalLabel}>{label}</div>
        <div className={Styles.horizontalValue}>{value}</div>
    </div>
  )
}


export default Calculator;
