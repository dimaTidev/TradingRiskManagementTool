import React from 'react'
import Styles from "./tradePanel.module.css";

export default function InfoField({label, text}) {
  return (
    <div className={Styles.field}>
        <div className={Styles.label}>{label}:</div>
        <div className={Styles.infoFieldText}>{text}</div>
    </div>
  )
}