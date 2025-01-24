'use client';

import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import Styles from "./messageManager.module.css";
import ButtonIcon from '@/lib/UIComponents/ButtonIcon';
import { Size } from '@/lib/UIComponents/uiCommon';

export const messageVariant = {
    DEFAULT: "default",
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error"
}

// Create a context and use it within the component
export const SideToastContext = React.createContext({
    showMessage(title, message, variant){},
    hideMessage(messageGuid){},
});


export function SideToastContextProvider({ children }) {
    const [_, setRedraw] = useReducer(s => s + 1, 0);
    // const [messages, setMessages] = useState(["hello"]);
    const messages = useRef(new Map());
    const guid = useRef(0);

    function handleShowMessage(title, message, variant = messageVariant.DEFAULT) {
        const newGuid = guid.current + 1;
        guid.current = newGuid;

        messages.current.set(newGuid, {
            title: title,
            message: message,
            variant: variant
        });

        setRedraw();

        return newGuid;
    }

    function handleHideMessage(messageGuid) {
        
        messages.current.delete(messageGuid);

        setRedraw();
    }

    let messagesToDraw = [];

    messages.current.forEach((value, key) => {
        messagesToDraw.push(<Message key={key} guid={key} {...value}/>);
    })

    return (
        <SideToastContext.Provider value={{
            showMessage: handleShowMessage,
            hideMessage: handleHideMessage
        }}>
            <div className={Styles.messagesContainer}>
                {messagesToDraw}
            </div>
            {/* <TestPlatfomAPIContextProvider/> */}
            {children}
        </SideToastContext.Provider>
    )
};


export function TestPlatfomAPIContextProvider({ children }) {
    const sideToastContext = useContext(SideToastContext);

    return (
        <>
            <button onClick={() => sideToastContext.showMessage("Message", `{"retCode":0,"retMsg":"OK","result":{"orderId":"28986dd0-873c-48d3-a58e-c7b23cece986","orderLinkId":""},"retExtInfo":{},"time":1737663190585}`, messageVariant.DEFAULT)}>Show Long message</button>
            <button onClick={() => sideToastContext.showMessage("Message", "default", messageVariant.DEFAULT)}>Show Default</button>
            <button onClick={() => sideToastContext.showMessage("Message", "warning", messageVariant.WARNING)}>Show Warning</button>
            <button onClick={() => sideToastContext.showMessage("Message", "success", messageVariant.SUCCESS)}>Show success</button>
            <button onClick={() => sideToastContext.showMessage("Message", "error", messageVariant.ERROR)}>Show error</button>
        </>
    )
}


function Message({guid, title, message, hideTimer = 20000, variant = messageVariant.DEFAULT}) {
    const sideToastContext = useContext(SideToastContext);
    const [show, setShow] = useState(undefined);

    useEffect(() => {
        setShow(true); // Trigger fade-in when component mounts

        const timer = setTimeout(() => {
            setShow(false);
        }, hideTimer);
        
        return () => clearTimeout(timer); // Cleanup
    }, []);

    useEffect(() => {
        if(show == false){
            const timer = setTimeout(() => {
                sideToastContext.hideMessage(guid);
            }, 300);
            
            return () => clearTimeout(timer); // Cleanup
        }
    }, [show]);

    return (
        <div className={`${Styles.sideToast} ${show && Styles.sideToastPop} ${Styles[`variant_${variant}`]}`}>
            <div className={Styles.messageHeader}>
                {title}
                <ButtonIcon src="close.svg" size={Size.XS} quiet={true} onClick={() => setShow(false)}/>
            </div>
            <hr/>
            <pre className={Styles.messageDescription}>{message}</pre>
        </div>
    )
}
