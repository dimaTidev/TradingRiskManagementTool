import { useContext, useState } from "react";
import Styles from "./accounts.module.css";
import { AccountsContext } from "./accountsContext";
import ButtonIcon from "@/lib/UIComponents/ButtonIcon";
import { Size } from "@/lib/UIComponents/uiCommon";
import Icon from "@/lib/UIComponents/icon";
import Card from "@/lib/UIComponents/card";
import Button from "@/lib/UIComponents/Button";
import SimpleModal from "./simpleModal";
import InputField from "@/lib/UIComponents/InputField";
import Panel from "@/lib/UIComponents/panel";
import { AccountSelectedContext } from "./accountSelectedContext";

export default function AccountList(params){
    const accountsContext = useContext(AccountsContext);
    const accountSelectedContext = useContext(AccountSelectedContext);

    function handleDeleteEntry(guid){
        accountsContext.removeAccount(guid);
    }

    function handleSelectEntry(guid){
        accountSelectedContext.setAccountGUID(guid);
    }

    const toDraw = accountsContext.allAccounts.map((value, key) =>{
        const decryptred = accountsContext.decryptAccount(value);
        return <AccountListEntry 
        key={key} 

        guid={decryptred.guid} 
        platformName={decryptred.platformName} 
        title={decryptred.title} 
        notes={decryptred.notes} 
        isDemoAccount={decryptred.isDemoAccount} 

        activeGUID={accountSelectedContext?.selectedAccountGUID}

        onDelete={handleDeleteEntry} 
        onSelect={handleSelectEntry}/>
    });

    return (
        <div className={`${Styles.accountList}`} {...params}>
            {toDraw}
        </div>
    ) 
}

export function AccountListEntry({guid, platformName, title, notes, isDemoAccount, onDelete, onSelect, activeGUID, ...params}){

    function handleDelete(e){
        e.stopPropagation();
        onDelete?.(guid);
    }

    return (
        <Card onClick={() => onSelect?.(guid)} className={`${Styles.accountListEntry}`} {...params} selected={activeGUID == guid}>
            <Icon src="bybit-logo.svg"/>
            <div className={Styles.accountListEntry_textContainer}>
                <div className={Styles.accountListEntry_titleContainer}>
                    <a className={Styles.accountListEntry_title}>{title ? title : platformName}</a>
                    {isDemoAccount && <a style={{color: "orange"}}>demo</a>}
                </div>
                <div className={Styles.accountListEntry_notes}>{notes}</div>
            </div>
            {onDelete && <ButtonIcon type="button" src="delete.svg" size={Size.XS} onClick={handleDelete}/>}
        </Card>
    ) 
}

export function AccountCreationButton(){
    const [openConnectPanel, setOpenConnectPanel] = useState(false);

    return (
    <>
        <Button onClick={() => setOpenConnectPanel(true)}>Connect account</Button>
        {openConnectPanel && (
            <SimpleModal>
                <Panel headerTitle="Connect account" onClose={() => setOpenConnectPanel(false)}>
                    <ConnectAccountForm onCompleted={() => setOpenConnectPanel(false)}/>
                </Panel>
                
            </SimpleModal>
        )}
    </>
)}

export function ConnectAccountForm({onCompleted}) {
    const accountsContext = useContext(AccountsContext);

    function handleSubmit(e){
        e.preventDefault();

        const formData = new FormData(e.target);

        const data = {};
        formData.forEach((value, key) => {
            if(value != "" && value != undefined){
                data[key] = value;
            }
        });

        accountsContext.createAccount({...data});

        onCompleted?.();
    }

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                    <select name="platformName">
                        <option value="bybit">Bybit</option>
                    </select>
                    <InputField name="title" placeholder='title' required/>
                    <InputField name="notes" placeholder='notes' />
                    <InputField name="apiKey" placeholder='API key' required/>
                    <InputField name="apiSecret"placeholder='API secret' required/>
                    <InputField name="isDemoAccount" type="checkbox" placeholder='demo'/>
                </div>

                <Button size={Size.S} type="submit">Add account</Button>
            </form>
        </div>
    )
}