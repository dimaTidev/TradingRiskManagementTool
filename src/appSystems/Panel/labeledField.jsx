import React from 'react'
import Styles from "./labeledField.module.css";

export default function LabeledField({ children, label, disabled }) {
  return (
    <div className={Styles.base}>
        <div className={`${Styles.label} ${disabled && Styles.labelDisabled}`}>{label}</div>
        {children}
    </div>
  )
}
