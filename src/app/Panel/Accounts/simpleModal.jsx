import React from 'react'
import Styles from './simpleModal.module.css'

export default function SimpleModal({children, ...params}) {
  return (
    <div className={Styles.base}>
        {/* <div {...params}> */}
            {children}
        {/* </div> */}
    </div>
  )
}
