import ActionButton from '@/lib/UIComponents/ActionButton'
import React from 'react'
import Styles from "./orderButtons.module.css";
import { Size, Variant } from '@/lib/UIComponents/uiCommon';
import Button from '@/lib/UIComponents/Button';

export default function OrderButtons({ longLimitOrderCallback, shortLimitOrderCallback, longMarketOrderCallback, shortMarketOrderCallback, disabled }) {
  return (
    <div className={Styles.base}>
        <div className={Styles.container}>
            <Button onClick={() => longLimitOrderCallback?.()} size={Size.S} variant={Variant.SUCCESS} disabled={disabled}>Long / Limit</Button>
            <Button onClick={() => shortLimitOrderCallback?.()} size={Size.S} variant={Variant.ERROR} disabled={disabled}>Short / Limit</Button>
        </div>
        {/* <hr/> */}
        <div className={Styles.container}>
            <Button onClick={() => longMarketOrderCallback?.()} size={Size.S} variant={Variant.SUCCESS} disabled={disabled}>Long / Market</Button>
            <Button onClick={() => shortMarketOrderCallback?.()} size={Size.S} variant={Variant.ERROR} disabled={disabled}>Short / Market</Button>
        </div>
    </div>
  )
}
