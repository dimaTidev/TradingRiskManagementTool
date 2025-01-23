import ActionButton from '@/lib/UIComponents/ActionButton'
import React from 'react'
import Styles from "./orderButtons.module.css";

export default function OrderButtons({ longLimitOrderCallback, shortLimitOrderCallback, longMarketOrderCallback, shortMarketOrderCallback, disabled }) {
  return (
    <div className={Styles.base}>
        <div className={Styles.container}>
            <ActionButton onClick={() => longLimitOrderCallback?.()} disabled={disabled}>Long (Limit)</ActionButton>
            <ActionButton onClick={() => shortLimitOrderCallback?.()} disabled={disabled}>Short (Limit)</ActionButton>
        </div>
        {/* <hr/> */}
        <div className={Styles.container}>
            <ActionButton onClick={() => longMarketOrderCallback?.()} disabled={disabled}>Long (Market)</ActionButton>
            <ActionButton onClick={() => shortMarketOrderCallback?.()} disabled={disabled}>Short (Market)</ActionButton>
        </div>
    </div>
  )
}
