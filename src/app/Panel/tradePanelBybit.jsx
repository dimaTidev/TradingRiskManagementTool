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
import ButtonIcon from '@/lib/UIComponents/ButtonIcon';
import { APICredentialsSettings } from './creadentials/credentials';
import TickerInfo from './Info/tickerInfo';
import { messageVariant, SideToastContext } from './messageManager/messageManager';
import { Size } from '@/lib/UIComponents/uiCommon';

const dataSaveKey = "tradingPanelInputs";

export default function TradePanelBybit() {
  const platformAPIContext = useContext(PlatformAPIContext);
  const sideToastContext = useContext(SideToastContext);
  // const [_, setRedraw] = useReducer(s => s + 1, 0);
  const inputDataRef = useRef();
  const [inputDataValid, setInputDataValid] = useState({});
  const [inputData, setInputData] = useState({});
  const [ticker, setTicker] = useState("");
  const [tickerInfoData, setTickerInfoData] = useState({});

  const [openSettings, setOpenSettings] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  let loadedData = undefined;

  try {
    loadedData = JSON.parse(localStorage.getItem(dataSaveKey));
  } catch (error) {
    
  }

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

            setIsLoading(true);
            const responceTickerInfo = await platformAPIContext.getTickerInfo(ticker);
            // TODO: handle error messages!

            setTickerInfoData(responceTickerInfo);
            setIsLoading(false);

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

  function handleInputDataChanged(){
    const data = inputDataRef.current?.getInputData();
    setInputData(data);
    localStorage.setItem(dataSaveKey, JSON.stringify(data));
  }
  
  //#region orders
  async function handlePlaceLongLimitOrder(){
    const data = {
      ticker: inputData.ticker,
      orderType: "Limit",
      assetVolume: orderData.assetVolume,
      leverage: orderData.leverage,
      orderPrice: inputData.entryPrice,
      takeProfitPrice: orderData.takeProfitPriceLong,
      stopLossPrice: orderData.stopLossPriceLong
    };

    sideToastContext.showMessage("Pending long limit order", `${JSON.stringify(data, null, 2)}`);

    const result = await platformAPIContext.placeLongOrder(data);
    sideToastContext.showMessage(`Long limit order ${result.isError ? "failed" : "placed"}`, result.isError ? result.error : "Placed successfuly", result.isError ? messageVariant.ERROR : messageVariant.SUCCESS);
  }

  async function handlePlaceShortLimitOrder(){
    const data = {
      ticker: inputData.ticker,
      orderType: "Limit",
      assetVolume: orderData.assetVolume,
      leverage: orderData.leverage,
      orderPrice: inputData.entryPrice,
      takeProfitPrice: orderData.takeProfitPriceShort,
      stopLossPrice: orderData.stopLossPriceShort
    };

    sideToastContext.showMessage("Pending short limit order", `${JSON.stringify(data, null, 2)}`);

    const result = await platformAPIContext.placeShortOrder(data);
    sideToastContext.showMessage(`Short limit order ${result.isError ? "failed" : "placed"}`, result.isError ? result.error : "Placed successfuly", result.isError ? messageVariant.ERROR : messageVariant.SUCCESS);
  }

  async function handlePlaceLongMarketOrderAsync(){
    sideToastContext.showMessage("Pending long market order", `Checking market price`)
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

    sideToastContext.showMessage("Pending long market order", `${JSON.stringify(data, null, 2)}`);

    const result = await platformAPIContext.placeLongOrder(data);
    sideToastContext.showMessage(`Long market order ${result.isError ? "failed" : "placed"}`, result.isError ? result.error : "Placed successfuly", result.isError ? messageVariant.ERROR : messageVariant.SUCCESS);
  }

  async function handlePlaceShortMarketOrderAsync(){
    sideToastContext.showMessage("Pending short market order", `Checking market price`);
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

    sideToastContext.showMessage("Pending short market order", `${JSON.stringify(data, null, 2)}`);

    const result = await platformAPIContext.placeShortOrder(data);
    sideToastContext.showMessage(`Short market order ${result.isError ? "failed" : "placed"}`, result.isError ? result.error : "Placed successfuly", result.isError ? messageVariant.ERROR : messageVariant.SUCCESS);
  }
  //#endregion

  return (
    <>
      { platformAPIContext.CheckCredentialsAndPasswordSaved() ? (
        <Panel headerTitle="Bybit" headerContent={(
          <>
            {platformAPIContext.isDemoTrading && <a className={Styles.warnText}>Demo trading</a>}
            <ButtonIcon src="settings.svg" quiet={true} size={Size.S} onClick={() => setOpenSettings((s) => !s)}/>
          </>
        )}>
          
          {!openSettings && (
            <>
              <div className={Styles.base}>
                <Inputs 
                  ref={inputDataRef} 
                  className={Styles.leftSide} 
                  onChange={handleInputDataChanged} 
                  onTickerChanged={(t) => setTicker(t)}
                  onValidInputs={setInputDataValid}
                  checkValidTickerAsync={async (ticker) => {
                    setIsLoading(true);
                    const result = await platformAPIContext.getTickerInfo(ticker);
                    setIsLoading(false);
                    return result.errorMsg == undefined;
                  }}
                  checkTickerPriceAsync={async (ticker) => {
                    setIsLoading(true);
                    const result = await platformAPIContext.getTickerPricing(ticker);
                    setIsLoading(false);
                    return result.markPrice;
                  }}

                  defaultValues={loadedData}
                />
                <div className={Styles.rightSide}>
                  <div className={Styles.infoContainer}>
                    <TickerInfo {...tickerInfoData}/>
                  </div>
                  <div className={Styles.infoContainer}>
                    <OrderCalculationInfo {...orderData}/>
                  </div>
                </div>
              </div>

              <hr/>
              <OrderButtons 
                longLimitOrderCallback={handlePlaceLongLimitOrder}
                shortLimitOrderCallback={handlePlaceShortLimitOrder}          
                longMarketOrderCallback={handlePlaceLongMarketOrderAsync}
                shortMarketOrderCallback={handlePlaceShortMarketOrderAsync}
                disabled={isLoading || !inputDataValid}
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
