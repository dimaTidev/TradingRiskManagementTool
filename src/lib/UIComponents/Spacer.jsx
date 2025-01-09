import React from 'react'
import Styles from "./Sapacer.module.css"

/**
 * @enum {string}
 */
export const SizeSpacer = {
  // XXS: "XXS",  // 0.25rem
  XS: "XS",    // 0.5rem
  S: "S",      // 1rem
  M: "M",      // 1.5rem
  L: "L",      // 2rem
  XL: "XL",    // 3rem
  // XXL: "XXL",  // 4rem
  // XL3: "XL3",  // 5rem
  XL4: "XL4",  // 6rem
  // XL5: "XL5",  // 8rem
  // XL6: "XL6",  // 10rem
  };
  

export default function Spacer({size}) {

    size ??= SizeSpacer.M;

  return (
    <div className={Styles[`spacerSize_${size}`]}>
    </div>
  )
}
