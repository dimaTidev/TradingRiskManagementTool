import React, { useState } from "react";
import Styles from "./InputField.module.css";
import ButtonIcon, { Size } from "./ButtonIcon";
import InputField from "./InputField";

/**
 * @param {Object} props - The props object.
 * @param {string} [props.label] - The label for the input field.
 * @param {string} props.value - The current value of the input field.
 * @param {string} [props.placeholder=""] - The placeholder text displayed when the input is empty.
 * @param {string} [props.defaultValue=""]
 * @param {boolean} [props.error=false] - If true, applies error styling to the input field.
 * @param {Number} [props.maxLength=50]
 * @param {function} [props.onChange]
 */
export default function InputFieldPassword({...props}) {
  const [showPassword, setShowPassword] = useState(false);

  props.maxLength ??= 50;
  props.error ??= false;

  return (
    <div className={Styles.inputGroup}>
      {props.label && <label className={Styles.label}>{props.label}</label>}
      <div className={Styles.inputContainer}>
        <input
          type={showPassword ? "text" : "password"}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          defaultValue={props.defaultValue}
          className={Styles.inputField}
          maxLength={props.maxLength}
          style={{ borderColor: props.error ? "var(--color-error)" : "" }}
        />

        {/* TODO: Replace icons with
https://fonts.google.com/icons?selected=Material+Symbols+Outlined:visibility:FILL@0;wght@400;GRAD@0;opsz@20&icon.query=eye&icon.size=16&icon.color=%23e8eaed */}
        <ButtonIcon
          src={showPassword ? "/visibility_off.svg" : "/visibility.svg"}
          onClick={() => setShowPassword((s) => !s)}
          size={Size.L}
          quiet={true}
          style={{position: "absolute", right: "0.75rem", top: "50%", translate: "0 -50%"}}
        />
      </div>
    </div>
  );
}
