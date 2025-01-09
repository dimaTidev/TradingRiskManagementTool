import React, { forwardRef } from "react";
import Styles from "./InputField.module.css";

/**
 * @param {Object} props - The props object.
 * @param {string} [props.label] - The label for the input field.
 * @param {boolean} [props.error=false] - If true, applies error styling to the input field.
 */
const InputField = forwardRef(({ ...props }, ref) => {
  props.maxLength ??= 50;
  return (
    <div className={`${Styles.inputGroup} ${props.className}`}>
      {props.label && <label className={Styles.label}>{props.label}</label>}
      <input
        {...props}
        ref={ref}
        className={Styles.inputField}
        style={{ borderColor: props.error ? "var(--color-error)" : "", ...props.style }}
      />
    </div>
  );
});

export default InputField;