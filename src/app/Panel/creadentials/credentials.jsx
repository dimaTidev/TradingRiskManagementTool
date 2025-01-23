import { useContext, useState } from "react";
import Styles from "./credentials.module.css";
import { PlatformAPIContext } from "@/app/Components/platformAPIContext";
import ButtonIcon, { Size } from "@/lib/UIComponents/ButtonIcon";
import InputField from "@/app/Components/inputField";
import ToggleField from "@/app/Components/toggleField";
import ActionButton, { Variant } from "@/lib/UIComponents/ActionButton";
import { messageVariant, SideToastContext } from "../messageManager/messageManager";

export function APICredentialsSettings() {
    const platformAPIContext = useContext(PlatformAPIContext);

    const [apiKey, setApiKey] = useState("");
    const [apiSecret, setApiSecret] = useState("");
    const [apiPass, setApiPass] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [demoTrading, setDemoTrading] = useState("");

    async function handleApply(){
        const responce = await platformAPIContext.setAPICredentials(apiKey, apiSecret, apiPass, demoTrading);
        setErrorMsg(responce.errorMsg);
    }

    return (
        <div className={Styles.credentialSettings}>
            {!platformAPIContext.CheckCredentialsSaved() ? <>
                <InputField value={apiKey} onChange={(e) => setApiKey(e.target.value)} label="API key"/>
                <InputField value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} label="API secret"/>
                <div className={Styles.helpText}>
                    Your API key and secret will be stored locally on your machine protected by a password. Make sure to remember the password. In the next page visit you will need to enter the password in order to decrypt the API key and secret. If you forget the password, no worries, reenter the API key and secret with a new password.
                </div>
                <ToggleField checked={demoTrading ? "checked" : ""} onChange={() => setDemoTrading((s) => !s)} label="Demo trading"/>
                {demoTrading && <div className={Styles.helpText}>
                    If you check demo trading on make sure you took the demo trading API key and secret! Otherwise you will see an error on authorization.
                </div>}
                <hr/>
                <InputField value={apiPass} onChange={(e) => setApiPass(e.target.value)} label="Password"/>
                <div className={Styles.helpText}>
                    Make up a password to encrypt your API key and secret. Later you will need to enter this password to decrypt your credentials
                </div>
                <hr/>
                <ActionButton variant={Variant.Default} onClick={handleApply}
                    disabled={apiKey == "" || apiSecret == "" || apiPass == "" ? "disabled" : ""}
                >Connect account</ActionButton>
            </> : <UnlockCredentialsField/>}
            {errorMsg && errorMsg != "" && <div className={Styles.errorText}>{errorMsg}</div>}
        </div>
    )
}

export function APICredentialsSettingsRemoveButton({onRemoveCredentials}) {
    const platformAPIContext = useContext(PlatformAPIContext);
    const sideToastContext = useContext(SideToastContext);

  return (
        <div className={`${Styles.credentialSettings} ${Styles.dangerField}`} style={{flexDirection: "row", alignItems: "center"}}>
            {platformAPIContext.isDemoTrading ? "Demo acc." : ""} Remove API key and secret 
            <ButtonIcon size={Size.L} src="delete.svg" onClick={() => {
                platformAPIContext.deleteCredentials();
                onRemoveCredentials?.();
                sideToastContext.showMessage("Account removed", "Account removed successfuly", messageVariant.SUCCESS);
            }}/>
        </div>
  )
}

export function UnlockCredentialsField() {
    const platformAPIContext = useContext(PlatformAPIContext);
    const [apiPass, setApiPass] = useState("");
    
  return (
    <>
        <div className={Styles.unlockCredentialsField}>
            <InputField onChange={(e) => setApiPass(e.target.value)} label="Enter password"/>
            <ButtonIcon size={Size.L} src="delete.svg" onClick={() => platformAPIContext.deleteCredentials()}/>
        </div>
        <div className={Styles.helpText}>
            Enter the password to decrypt your API key and Secret. If you forgot the password click the delete button.
        </div>
        <hr/>
        <ActionButton variant={Variant.Default} onClick={(e) => platformAPIContext.setPassword(apiPass)} disabled={apiPass == "" ? "disabled" : ""}>Decrypt</ActionButton>
    </>
  )
}