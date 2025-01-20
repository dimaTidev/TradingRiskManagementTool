import React from 'react'
import Styles from "./infoStyles.module.css";
import { HorizontalInfo } from './horizontalInfo';
import { roundNumber } from '@/app/Components/tradeUtils';

/**
 * Displays order calculation information based on the provided parameters.
 * 
 * @param {Object} params - The parameters for the order calculation info.
 * @param {string} [params.className] - Additional CSS classes for the container.
 * @param {number} [params.leverage] - Leverage multiplier for the trade.
 * @param {number} [params.volume] - Total trading volume.
 * @param {number} [params.assetVolume] - Volume of the traded asset.
 * @param {number} [params.marginInDeal] - Margin required for the deal.
 * @param {number} [params.stopLossPercent] - Stop loss percentage.
 * @param {number} [params.capital] - Total capital available for trading.
 * 
 * @returns {JSX.Element} A React component displaying order calculation information.
 */
export default function OrderCalculationInfo(params) {
  return (
    <div className={`${Styles.infoContainer} ${params.className}`}>
        <a>Order Calculation</a>
        <hr/>
        <HorizontalInfo label="Leverage" value={roundNumber(params.leverage)?.toString()}/>
        {/* <HorizontalInfo label="xVolumeX" value={roundNumber(params.incorrectVolume)?.toString()}/> */}
        <HorizontalInfo label="Volume" value={roundNumber(params.volume)?.toString()}/>
        <HorizontalInfo label="Margin" value={roundNumber(params.marginInDeal)?.toString()}/>
        <HorizontalInfo label="Asset vol" value={roundNumber(params.assetVolume, 10)?.toString()}/>
        <hr/>
        <HorizontalInfo label="EntryPrice" value={roundNumber(params.price)?.toString()}/>
        <hr/>
        <HorizontalInfo label="SLLong" value={roundNumber(params.stopLossPriceLong)?.toString()}/>
        <HorizontalInfo label="TPLong" value={roundNumber(params.takeProfitPriceLong)?.toString()}/>
        <hr/>
        <HorizontalInfo label="SLShort" value={roundNumber(params.stopLossPriceShort)?.toString()}/>
        <HorizontalInfo label="TPShort" value={roundNumber(params.takeProfitPriceShort)?.toString()}/>
        <hr/>
        <HorizontalInfo label="Risk" value={roundNumber(params.risk)?.toString()}/>
        <HorizontalInfo label="Risk, %" value={`${roundNumber(params.riskPercent)?.toString()}%`}/>
    </div>
  )
}
