import React from 'react'

export default function TickerInfo() {
  return (
    <div className={Styles.subInfoContainer}>
        <a>Ticker info</a>
        <hr/>
        <HorizontalInfo label="Ticker" value="value"/>
        <HorizontalInfo label="Max Leverage" value="value"/>
        <HorizontalInfo label="Min qty" value="value"/>
        <HorizontalInfo label="Qty step" value="value"/>
    </div>
  )
}