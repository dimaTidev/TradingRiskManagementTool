'use client';

import SimpleModal from './simpleModal'
import Panel from '@/lib/UIComponents/panel'
import InputField from '@/lib/UIComponents/InputField'
import Button from '@/lib/UIComponents/Button'
import { Size, Variant } from '@/lib/UIComponents/uiCommon'
import Callout from '@/lib/UIComponents/callout'
import { useContext } from 'react'
import { AccountsContext } from './accountsContext'

export default function CheckAccountsPassword({onCompleted}) {
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

        if(await accountsContext.checkAndSetPasswordAsync(data.password)){
            onCompleted?.();
        }else{
            console.error("Wrong password!");
        }
    }

  return (
    <>
        {(accountsContext.isPasswordSaved && !accountsContext.isPasswordChecked) && (
            <SimpleModal>
                <Panel headerTitle="Unlock accounts">
                    <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                        <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                            <InputField name="password" autoComplete="off" placeholder='Enter the password' required/>
                            <Callout variant={Variant.SECONDARY}>Enter the password</Callout>
                        </div>

                        <hr/>
                        <Button size={Size.S} type="submit">Unlock accounts</Button>
                    </form>
                </Panel>
            </SimpleModal>
        )}
    
    </>
    
  )
}
