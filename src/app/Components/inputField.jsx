import React, {forwardRef} from 'react'
import Styles from "./tradePanel.module.css";

const InputField = forwardRef(({...props}, ref) => {
    return (
        <div className={Styles.field}>
            <div className={Styles.label}>{props.label}:</div>
            <input ref={ref} {...props} className={Styles.infoFieldText}></input>
        </div>
    )
});

export default InputField;