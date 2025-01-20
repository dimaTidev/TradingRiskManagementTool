import ActionButton from '@/lib/UIComponents/ActionButton'
import React from 'react'
import Styles from "./orderButtons.module.css";

export default function OrderButtons({ longLimitOrderCallback, shortLimitOrderCallback, longMarketOrderCallback, shortMarketOrderCallback }) {
  return (
    <div className={Styles.base}>
        <div className={Styles.container}>
            <ActionButton onClick={() => longLimitOrderCallback?.()}>Long (Limit)</ActionButton>
            <ActionButton onClick={() => shortLimitOrderCallback?.()}>Short (Limit)</ActionButton>
        </div>
        {/* <hr/> */}
        <div className={Styles.container}>
            <ActionButton onClick={() => longMarketOrderCallback?.()}>Long (Market)</ActionButton>
            <ActionButton onClick={() => shortMarketOrderCallback?.()}>Short (Market)</ActionButton>
        </div>
    </div>
  )
}
