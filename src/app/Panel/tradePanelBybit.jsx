'use client';

import React, { useContext, useRef } from 'react'
import Panel from './panel'
import Calculator from './calculator'
import OrderButtons from './orderButtons';
import { PlatformAPIContext } from '../Components/platformAPIContext';

export default function TradePanelBybit() {
  const platformAPIContext = useContext(PlatformAPIContext);
  const inputData = useRef();
  
  return (
    <Panel headerTitle="Bybit">
        <Calculator ref={inputData}/>
        <hr/>
        <OrderButtons 
          longLimitOrderCallback={() => {
            const data = {...inputData.current.getInputData(), orderType: "Limit"}
            platformAPIContext.placeLongOrder(data);
          }}

          shortLimitOrderCallback={() => {
            const data = {...inputData.current.getInputData(), orderType: "Limit"}
            platformAPIContext.placeShortOrder(data);
          }}
        />
    </Panel>
  )
}
