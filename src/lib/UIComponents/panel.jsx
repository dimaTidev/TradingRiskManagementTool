import React from 'react'
import Styles from "./panel.module.css";
import ButtonIcon from './ButtonIcon';
import { Size } from './uiCommon';

export default function Panel({ children, headerTitle, headerContent, onClose }) {
    return (
      <div className={Styles.panel}>
          <div className={Styles.header}>
            {headerTitle}
            {headerContent}
            {onClose && <ButtonIcon size={Size.S} quiet={true} src="close.svg" onClick={onClose}/>}
          </div>
          <hr/>
          <div className={Styles.body}>
            {children}
          </div>
      </div>
    )
  }