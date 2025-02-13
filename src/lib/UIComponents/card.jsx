import React from 'react'
import Styles from "./card.module.css";

export default function Card({interactable = true, className, selected, ...params}) {
  return (
    <div {...params} className={`${Styles.card} ${interactable == true ? Styles.interactable: ""} ${className} ${selected ? Styles.selected: ""}`}>
        {params.children}
    </div>
  )
}
