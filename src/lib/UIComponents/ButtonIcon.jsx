import React from "react";
import Image from "next/image";
import Styles from "./ButtonIcon.module.css";
import StylesCommon from "./common.module.css";
import { Size, Variant } from "./uiCommon";
import Icon from "./icon";

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
  // style,
  className,
  // onClick,
  quiet = false,
  variant = Variant.DEFAULT,
  ...params
}) {
  // let iconClass = Styles.buttonIcon_M;

  // if (size === Size.S) {
  //   iconClass = Styles.buttonIcon_S;
  // } else if (size === Size.L) {
  //   iconClass = Styles.buttonIcon_L;
  // } else if (size === Size.XL) {
  //   iconClass = Styles.buttonIcon_XL;
  // }

  // // Calculating the variant appearance
  // let variantClass = Styles.buttonIcon_Default;

  // if (variant === Variant.Primary) {
  //   variantClass = Styles.buttonIcon_Primary;
  // }

  // Button size
  const buttonSizeClass = `${StylesCommon[`sizeSquare_${size}`]}`;

  // Appearance
  const variantClass = StylesCommon[`buttonVariant_${variant}`];

  return (
    <button
      className={`${StylesCommon.buttonBase} ${Styles.buttonIcon} ${variantClass} ${buttonSizeClass} ${quiet ? StylesCommon.quiet : ""} ${className}`}
      {...params}
    >
      <Icon src={src} alt={params.alt} size={size}/>
    </button>
  );
}
