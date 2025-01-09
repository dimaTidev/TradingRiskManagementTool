import React, {forwardRef} from 'react'
import Styles from "./tradePanel.module.css";

const ToggleField = forwardRef(({...props}, ref) => {
    return (
        <div className={Styles.field}>
            <div className={Styles.label}>{props.label}:</div>
            <input {...props} type='checkbox'></input>
        </div>
    )
});

export default ToggleField;