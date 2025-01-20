'use client';

import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import Panel from './panel'
import Styles from "./tradePanel.module.css";
import OrderButtons from './orderButtons';
import { PlatformAPIContext } from '../Components/platformAPIContext';
import Inputs from './inputs';
import { calculateRiskOrderSimple } from '../Components/tradeUtils';
import OrderCalculationInfo from './Info/orderCalculationInfo';
import { getTickerPricing } from '../Components/PlatformsAPI/bybit';
import Settings from './panelSettings';
import ButtonIcon, { Size } from '@/lib/UIComponents/ButtonIcon';
import { APICredentialsSettings } from './creadentials/credentials';

export default function TradePanelBybit() {
  const platformAPIContext = useContext(PlatformAPIContext);
  const [_, setRedraw] = useReducer(s => s + 1, 0);
  const inputDataRef = useRef();
  // const [inputData, setInputData] = useState(second)

  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    if (inputDataRef.current) {
      setRedraw();
    }
  }, []);

  const inputData = inputDataRef.current?.getInputData();

  // TODO: Put arguments minAssetQty, assetQtyStep!
  const orderData = inputData == undefined ? {} : calculateRiskOrderSimple(inputData.capital, inputData.targetRisk, inputData.leverage, inputData.stopLossPercent, inputData.entryPrice, 0.001, 0.001, inputData.takeProfitRR);
  
  function handlePlaceLongLimitOrder(){
    const data = {
      ticker: inputData.ticker,
      orderType: "Limit",
      assetVolume: orderData.assetVolume,
      leverage: orderData.leverage,
      orderPrice: inputData.entryPrice,
      takeProfitPrice: orderData.takeProfitPriceLong,
      stopLossPrice: orderData.stopLossPriceLong
    };
    platformAPIContext.placeLongOrder(data);
  }

  function handlePlaceShortLimitOrder(){
    const data = {
      ticker: inputData.ticker,
      orderType: "Limit",
      assetVolume: orderData.assetVolume,
      leverage: orderData.leverage,
      orderPrice: inputData.entryPrice,
      takeProfitPrice: orderData.takeProfitPriceShort,
      stopLossPrice: orderData.stopLossPriceShort
    };
    platformAPIContext.placeShortOrder(data);
  }

  async function handlePlaceLongMarketOrderAsync(){
    const res = await getTickerPricing(inputData.ticker);
    assetPrice = Number.parseFloat(res.markPrice);

      // TODO: Put arguments minAssetQty, assetQtyStep!
    const orderData = inputData == undefined ? {} : calculateRiskOrderSimple(inputData.capital, inputData.targetRisk, inputData.leverage, inputData.stopLossPercent, assetPrice, 0.001, 0.001, inputData.takeProfitRR);

    const data = {
      ticker: inputData.ticker,
      orderType: "Market",
      assetVolume: orderData.assetVolume,
      leverage: orderData.leverage,
      // orderPrice: inputData.entryPrice,
      takeProfitPrice: orderData.takeProfitPriceLong,
      stopLossPrice: orderData.stopLossPriceLong
    };
    platformAPIContext.placeLongOrder(data);
  }

  async function handlePlaceShortMarketOrderAsync(){
    const res = await getTickerPricing(inputData.ticker);
    assetPrice = Number.parseFloat(res.markPrice);

      // TODO: Put arguments minAssetQty, assetQtyStep!
    const orderData = inputData == undefined ? {} : calculateRiskOrderSimple(inputData.capital, inputData.targetRisk, inputData.leverage, inputData.stopLossPercent, assetPrice, 0.001, 0.001, inputData.takeProfitRR);


    const data = {
      ticker: inputData.ticker,
      orderType: "Market",
      assetVolume: orderData.assetVolume,
      leverage: orderData.leverage,
      // orderPrice: inputData.entryPrice,
      takeProfitPrice: orderData.takeProfitPriceShort,
      stopLossPrice: orderData.stopLossPriceShort
    };
    platformAPIContext.placeShortOrder(data);
  }

  return (
    <>
      { platformAPIContext.CheckCredentialsAndPasswordSaved() ? (
        <Panel headerTitle="Bybit" headerContent={<ButtonIcon src="settings.svg" quiet={true} size={Size.L} onClick={() => setOpenSettings((s) => !s)}/>}>
          <div className={Styles.base}>
            <Inputs ref={inputDataRef} className={Styles.leftSide} onChange={() => setRedraw()}/>
            <div className={Styles.rightSide}>
              <OrderCalculationInfo {...orderData}/>
            </div>
            
          </div>
          
          <hr/>
          <OrderButtons 
            longLimitOrderCallback={handlePlaceLongLimitOrder}
            shortLimitOrderCallback={handlePlaceShortLimitOrder}          
            longMarketOrderCallback={handlePlaceLongMarketOrderAsync}
            shortMarketOrderCallback={handlePlaceShortMarketOrderAsync}
          />

          {openSettings && <Settings onClose={() => setOpenSettings(false)}/>}
          
        </Panel>
      ) : (
        <Panel headerTitle="Bybit">
          <APICredentialsSettings/>
        </Panel>
      )  
      }
    </>
    
  )
}
