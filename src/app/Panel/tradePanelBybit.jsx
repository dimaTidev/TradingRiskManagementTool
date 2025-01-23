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
import TickerInfo from './Info/tickerInfo';

export default function TradePanelBybit() {
  const platformAPIContext = useContext(PlatformAPIContext);
  // const [_, setRedraw] = useReducer(s => s + 1, 0);
  const inputDataRef = useRef();
  const [inputDataValid, setInputDataValid] = useState({});
  const [inputData, setInputData] = useState({});
  const [ticker, setTicker] = useState("");
  const [tickerInfoData, setTickerInfoData] = useState({});
  // const [inputData, setInputData] = useState(second)

  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    if (inputDataRef.current) {
      setInputData(inputDataRef.current?.getInputData());
      setTicker(inputDataRef.current?.getInputData()?.ticker);
      // setRedraw();
    }
  }, []);

  useEffect(() => {
    if(ticker != undefined && ticker != ""){
        const getTicker = async () => {
          try {

            if(!platformAPIContext.CheckCredentialsAndPasswordSaved())
              return;

            const responceTickerInfo = await platformAPIContext.getTickerInfo(ticker);
            console.log("responceTickerInfo", responceTickerInfo);
            
            setTickerInfoData(responceTickerInfo);

            console.log("tickerInfo for", ticker, JSON.stringify(responceTickerInfo));
          } catch (error) {
              console.error(error);
          }
      }
      
      getTicker();
    }
  }, [ticker]);

  // const inputData = inputDataRef.current?.getInputData();

  const orderData = inputData == undefined ? {} : calculateRiskOrderSimple(
    inputData.capital, 
    inputData.targetRisk, 
    inputData.leverage, 
    inputData.stopLossPercent, 
    inputData.entryPrice, 
    tickerInfoData.minOrderQty, 
    tickerInfoData.qtyStep, 
    inputData.takeProfitRR);
  
  //#region orders
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
    const assetPrice = Number.parseFloat(res.markPrice);

    const orderData = inputData == undefined ? {} : calculateRiskOrderSimple(inputData.capital, inputData.targetRisk, inputData.leverage, inputData.stopLossPercent, assetPrice, tickerInfoData.minOrderQty, tickerInfoData.qtyStep, inputData.takeProfitRR);

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
    const assetPrice = Number.parseFloat(res.markPrice);
    
    const orderData = inputData == undefined ? {} : calculateRiskOrderSimple(inputData.capital, inputData.targetRisk, inputData.leverage, inputData.stopLossPercent, assetPrice, tickerInfoData.minOrderQty, tickerInfoData.qtyStep, inputData.takeProfitRR);

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
  //#endregion

  return (
    <>
      { platformAPIContext.CheckCredentialsAndPasswordSaved() ? (
        <Panel headerTitle="Bybit" headerContent={<ButtonIcon src="settings.svg" quiet={true} size={Size.L} onClick={() => setOpenSettings((s) => !s)}/>}>

          {!openSettings && (
            <>
              <div className={Styles.base}>
                <Inputs 
                  ref={inputDataRef} 
                  className={Styles.leftSide} 
                  onChange={() => setInputData(inputDataRef.current?.getInputData())} 
                  onTickerChanged={(t) => setTicker(t)}
                  onValidInputs={setInputDataValid}
                  checkValidTickerAsync={async (ticker) => {
                    const result = await platformAPIContext.getTickerInfo(ticker);
                    console.log("getTickerInfo async", result);
                    return result.errorMsg == undefined;
                  }}
                />
                <div className={Styles.rightSide}>
                  <TickerInfo {...tickerInfoData}/>
                  <OrderCalculationInfo {...orderData}/>
                </div>
                
              </div>

              <hr/>
              <OrderButtons 
                longLimitOrderCallback={handlePlaceLongLimitOrder}
                shortLimitOrderCallback={handlePlaceShortLimitOrder}          
                longMarketOrderCallback={handlePlaceLongMarketOrderAsync}
                shortMarketOrderCallback={handlePlaceShortMarketOrderAsync}
                disabled={inputDataValid}
              />
            </>
          )}

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
