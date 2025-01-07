import React from "react";
import Image from "next/image";
import Styles from "./ActionButton.module.css";

/**
 * @enum {number}
 */
export const Size = {
  S: 2,
  M: 3,
  L: 4,
};

/**
 * @enum {number}
 */
export const Variant = {
  Default: 0,
  Primary: 1,
  Secondary: 2
};

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
export default function ActionButton({
  children,
  src,
  alt = "icon",
  size = Size.S,
  onClick,
  quiet = false,
  variant = Variant.Default,
  className,
  style,
  disabled = false,
  type = "button",
}) {
  // Calculating the button size
  let buttonSizeClass = Styles.actionButton_M;

  if (size === Size.S) {
    buttonSizeClass = Styles.actionButton_S;
  } else if (size === Size.L) {
    buttonSizeClass = Styles.actionButton_L;
  }

  // Calculating the text size
  let textClass = Styles.actionButtonText_M;

  if (size === Size.S) {
    textClass = Styles.actionButtonText_S;
  } else if (size === Size.L) {
    textClass = Styles.actionButtonText_L;
  }

  // Calculating the icon size
  let iconClass = Styles.actionButtonIcon_M;

  if (size === Size.S) {
    iconClass = Styles.actionButtonIcon_S;
  } else if (size === Size.L) {
    iconClass = Styles.actionButtonIcon_L;
  }

  // Calculating the variant appearance
  let variantClass = Styles.actionButton_Default;

  if (variant === Variant.Primary) {
    variantClass = Styles.actionButton_Primary;
  } else if (variant === Variant.Secondary) {
    variantClass = Styles.actionButton_Secondary;
  }

  return (
    <button
      className={`${Styles.actionButton} ${buttonSizeClass} ${variantClass} ${quiet ? Styles.quiet : ""} ${className}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
      type={type}
    >
      {src && (
        <div className={iconClass}>
          <Image src={src} fill alt={alt}></Image>
        </div>
      )}
      {children && <div className={textClass}>{children}</div>}
    </button>
  );
}
