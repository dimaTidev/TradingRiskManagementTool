import React from 'react'
import StylesCommon from "./common.module.css";
import Image from 'next/image';
import { Size } from './uiCommon';

export default function Icon({
    src,
    alt = "icon",
    size = Size.M,
}) {

    const iconSizeClass = StylesCommon[`iconSize_${size}`];

    return (
        <>
            {src && (
                <div className={iconSizeClass}>
                    <Image src={src} fill alt={alt}></Image>
                </div>
            )}
        </>
    )
}
