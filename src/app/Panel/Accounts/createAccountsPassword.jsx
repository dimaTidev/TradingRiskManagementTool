import React, { useContext } from 'react'
import SimpleModal from './simpleModal'
import Panel from '@/lib/UIComponents/panel'
import InputField from '@/lib/UIComponents/InputField'
import Button from '@/lib/UIComponents/Button'
import { Size, Variant } from '@/lib/UIComponents/uiCommon'
import Callout from '@/lib/UIComponents/callout'
import { AccountsContext } from './accountsContext'

export default function CreateAccountsPassword({onClose, onCompleted}) {
    const accountsContext = useContext(AccountsContext);

    async function handleSubmit(e){
        e.preventDefault();

        const formData = new FormData(e.target);

        const data = {};
        formData.forEach((value, key) => {
            if(value != "" && value != undefined){
                data[key] = value;
            }
        });

        if(await accountsContext.createPasswordAsync(data.password)){
            onCompleted?.();
        }else{
            console.error("Password failed!!!");
        }
    }

  return (
    <SimpleModal>
        <Panel headerTitle="Create password" onClose={() => onClose?.()}>
                <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                    <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                        <InputField name="password" autoComplete="off" placeholder='Enter a password' required/>
                        <Callout variant={Variant.SECONDARY}>Make up a password to encrypt your API key and secret. Later you will need to enter this password to decrypt your credentials</Callout>
                    </div>

                    <hr/>
                    <Button size={Size.S} type="submit">Create password</Button>
                </form>
        </Panel>
    </SimpleModal>
  )
}
