import React from 'react'
import Styles from "./labeledField.module.css";

export default function LabeledField({ children, label }) {
  return (
    <div className={Styles.base}>
        <div className={Styles.label}>{label}</div>
        {children}
    </div>
  )
}
