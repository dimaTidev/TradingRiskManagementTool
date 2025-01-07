import React from "react";
import Image from "next/image";
import Styles from "./ButtonIcon.module.css";

/**
 * @enum {number}
 */
export const Size = {
  S: 2,
  M: 3,
  L: 4,
  XL: 5,
};

/**
 * @enum {number}
 */
export const Variant = {
  Default: 0,
  Primary: 1,
};

/**
 * ButtonIconcomponent
 * @param {Object} props - The props object.
 * @param {number} [props.size=Size.M] - The size of the button, either Size.S, Size.M, or Size.L.
 * @param {string} props.src - The source URL or path for the button icon.
 * @param {Object} props.style - Custom inline styles for the button.
 * @param {string} props.className - Additional class names for the button.
 * @param {function} props.onClick - The function to handle button click events.
 * @param {boolean} [props.quiet=false] - Whether the button should have a quiet appearance.
 * @param {number} [props.variant=Variant.Default] - The variant of the button, either Variant.Default or Variant.Primary.
 */
export default function ButtonIcon({
  size = Size.M,
  src,
  style,
  className,
  onClick,
  quiet = false,
  variant = Variant.Default
}) {
  let iconClass = Styles.buttonIcon_M;

  if (size === Size.S) {
    iconClass = Styles.buttonIcon_S;
  } else if (size === Size.L) {
    iconClass = Styles.buttonIcon_L;
  } else if (size === Size.XL) {
    iconClass = Styles.buttonIcon_XL;
  }

  // Calculating the variant appearance
  let variantClass = Styles.buttonIcon_Default;

  if (variant === Variant.Primary) {
    variantClass = Styles.buttonIcon_Primary;
  }

  return (
    <button
      type="button"
      className={`${Styles.buttonIcon} ${variantClass} ${iconClass} ${quiet ? Styles.quiet : ""} ${className}`}
      style={style}
      onClick={onClick}
    >
      <div className={Styles.buttonIcon_iconContainer}>
        <Image src={src} fill alt="button-icon" />
      </div>
    </button>
  );
}
