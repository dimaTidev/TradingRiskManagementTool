import React from "react";
import StylesCommon from "./common.module.css";
import Styles from "./button.module.css";
import {Size, Variant} from "./uiCommon";
import Icon from "./icon";

/**
 * @param {Object} props - The component props.
 * @param {React.ReactNode} [props.children] - The content to be displayed inside the button.
 * @param {string} [props.src] - The source URL of the icon image.
 * @param {string} [props.alt="icon"] - The alt text for the icon image.
 * @param {number} [props.size=Size.S] - The size of the button, either Size.S or Size.M.
 * @param {number} [props.variant=Size.Default] - The size of the button, either Size.S or Size.M.
 * @param {function} [props.onClick] - The click event handler for the button.
 * @param {boolean} [props.quiet=false] - Whether the button should be rendered in a quiet style.
 */
export default function Button({
  children,
  src,
  alt = "icon",
  size = Size.M,
  quiet = false,
  variant = Variant.DEFAULT,
  className,
  ...params
}) {
  // Button size
  const buttonSizeClass = `${Styles[`buttonSizing_${size}`]} ${StylesCommon[`size_${size}`]}`;

  // Text size
  const textClass = StylesCommon[`textSize_${size}`];

  // Icon size
  const iconClass = StylesCommon[`iconSize_${size}`];

  // Appearance
  const variantClass = StylesCommon[`buttonVariant_${variant}`];

  return (
    <button
      className={`${StylesCommon.buttonBase} ${StylesCommon.baseHorizontal} ${buttonSizeClass} ${variantClass} ${quiet ? StylesCommon.quiet : ""} ${className}`}
      {...params}
    >
      <Icon src={src} alt={alt} size={size}/>
      {children && <div className={textClass}>{children}</div>}
    </button>
  );
}
