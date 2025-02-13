import React from 'react'
import {Variant} from "./uiCommon";
import Styles from "./callout.module.css";

export default function Callout({children, variant = Variant.DEFAULT, shrink = true, ...params}) {
  return (
    <div className={`${Styles.base} ${Styles[`base_${variant}`]} ${shrink ? Styles.shrink : ""}`} {...params}> {children} </div>
  )
}