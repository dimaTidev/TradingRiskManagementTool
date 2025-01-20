import React from 'react'
import Styles from "./infoStyles.module.css";
import { HorizontalInfo } from './horizontalInfo';

export default function TickerInfo(params) {
  return (
    <div className={`${Styles.infoContainer} ${params.className}`}>
        <a>Ticker info</a>
        <hr/>
        <HorizontalInfo label="BaseCoin" value={params.baseCoin}/>
        <HorizontalInfo label="QuoteCoin" value={params.quoteCoin}/>
        <HorizontalInfo label="Min Leverage" value={params.minLeverage}/>
        <HorizontalInfo label="Max Leverage" value={params.maxLeverage}/>
        <HorizontalInfo label="Min qty" value={params.minOrderQty}/>
        <HorizontalInfo label="Qty step" value={params.qtyStep}/>
    </div>
  )
}