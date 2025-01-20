import React from 'react'
import Styles from "./panel.module.css";

export default function Panel({ children, headerTitle, headerContent }) {
    return (
      <div className={Styles.panel}>
          <div className={Styles.header}>
            {headerTitle}
            {headerContent}
          </div>
          <hr/>
          <div className={Styles.body}>
            {children}
          </div>
      </div>
    )
  }