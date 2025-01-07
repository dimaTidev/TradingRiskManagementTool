import React, {forwardRef} from 'react'
import Styles from "./tradePanel.module.css";
import InputFieldComponent from '@/lib/UIComponents/InputField';

const InputField = forwardRef(({...props}, ref) => {
    return (
        <div className={Styles.field}>
            <div className={Styles.label}>{props.label}:</div>
            <InputFieldComponent ref={ref} {...props} label={undefined} className={Styles.inputField}/>
        </div>
    )
});

export default InputField;