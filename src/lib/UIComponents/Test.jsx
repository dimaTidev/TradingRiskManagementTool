import React from 'react'
import ActionButton from './ActionButton'
import { Size, Variant } from './uiCommon'
import ButtonIcon from './ButtonIcon'
import Button from './Button';
import Icon from './icon';
import Callout from './callout';

const styleVertical = {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
}

export default function TestUIComponents() {
    
    const icon = "close.svg";

  return (
    <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
        <div style={styleVertical}>
            <ActionButton size={Size.S}>S</ActionButton>
            <ActionButton size={Size.M}>M</ActionButton>
            <ActionButton size={Size.L}>L</ActionButton>
            <ActionButton src={icon} quiet={true}>Quiet</ActionButton>
            <hr/>
            <ActionButton variant={Variant.DEFAULT}>DEFAULT</ActionButton>
            <ActionButton variant={Variant.PRIMARY}>PRIMARY</ActionButton>
            <ActionButton variant={Variant.SECONDARY}>SECONDARY</ActionButton>
            <ActionButton variant={Variant.SUCCESS}>SUCCESS</ActionButton>
            <ActionButton variant={Variant.WARNING}>WARNING</ActionButton>
            <ActionButton variant={Variant.ERROR}>ERROR</ActionButton>
            <hr/>
            <ActionButton variant={Variant.DEFAULT} disabled>DEFAULT</ActionButton>
            <ActionButton variant={Variant.PRIMARY} disabled>PRIMARY</ActionButton>
            <ActionButton variant={Variant.SECONDARY} disabled>SECONDARY</ActionButton>
            <ActionButton variant={Variant.SUCCESS} disabled>SUCCESS</ActionButton>
            <ActionButton variant={Variant.WARNING} disabled>WARNING</ActionButton>
            <ActionButton variant={Variant.ERROR} disabled>ERROR</ActionButton>
        </div>

        <div style={styleVertical}>
            <ButtonIcon src={icon} size={Size.S}>S</ButtonIcon>
            <ButtonIcon src={icon} size={Size.M}>M</ButtonIcon>
            <ButtonIcon src={icon} size={Size.L}>L</ButtonIcon>
            <ButtonIcon src={icon} quiet={true}>Quiet</ButtonIcon>
            <hr/>
            <ButtonIcon src={icon} variant={Variant.DEFAULT}>DEFAULT</ButtonIcon>
            <ButtonIcon src={icon} variant={Variant.PRIMARY}>PRIMARY</ButtonIcon>
            <ButtonIcon src={icon} variant={Variant.SECONDARY}>SECONDARY</ButtonIcon>
            <ButtonIcon src={icon} variant={Variant.SUCCESS}>SUCCESS</ButtonIcon>
            <ButtonIcon src={icon} variant={Variant.WARNING}>WARNING</ButtonIcon>
            <ButtonIcon src={icon} variant={Variant.ERROR}>ERROR</ButtonIcon>
            <hr/>
            <ButtonIcon src={icon} variant={Variant.DEFAULT} disabled>DEFAULT</ButtonIcon>
            <ButtonIcon src={icon} variant={Variant.PRIMARY} disabled>PRIMARY</ButtonIcon>
            <ButtonIcon src={icon} variant={Variant.SECONDARY} disabled>SECONDARY</ButtonIcon>
            <ButtonIcon src={icon} variant={Variant.SUCCESS} disabled>SUCCESS</ButtonIcon>
            <ButtonIcon src={icon} variant={Variant.WARNING} disabled>WARNING</ButtonIcon>
            <ButtonIcon src={icon} variant={Variant.ERROR} disabled>ERROR</ButtonIcon>
        </div>


        <div style={styleVertical}>
            <Button src={icon} size={Size.S}>S</Button>
            <Button src={icon} size={Size.M}>M</Button>
            <Button src={icon} size={Size.L}>L</Button>
            <Button src={icon} quiet={true}>Quiet</Button>
            <hr/>
            <Button src={icon} variant={Variant.DEFAULT}>DEFAULT</Button>
            <Button src={icon} variant={Variant.PRIMARY}>PRIMARY</Button>
            <Button src={icon} variant={Variant.SECONDARY}>SECONDARY</Button>
            <Button src={icon} variant={Variant.SUCCESS}>SUCCESS</Button>
            <Button src={icon} variant={Variant.WARNING}>WARNING</Button>
            <Button src={icon} variant={Variant.ERROR}>ERROR</Button>
            <hr/>
            <Button src={icon} variant={Variant.DEFAULT} disabled>DEFAULT</Button>
            <Button src={icon} variant={Variant.PRIMARY} disabled>PRIMARY</Button>
            <Button src={icon} variant={Variant.SECONDARY} disabled>SECONDARY</Button>
            <Button src={icon} variant={Variant.SUCCESS} disabled>SUCCESS</Button>
            <Button src={icon} variant={Variant.WARNING} disabled>WARNING</Button>
            <Button src={icon} variant={Variant.ERROR} disabled>ERROR</Button>
        </div>

        <div style={styleVertical}>
            <Icon src={icon} size={Size.S}>S</Icon>
            <Icon src={icon} size={Size.M}>M</Icon>
            <Icon src={icon} size={Size.L}>L</Icon>
        </div>

        <div style={styleVertical}>
            <Callout variant={Variant.DEFAULT}>DEFAULT callout</Callout>
            <Callout variant={Variant.PRIMARY}>PRIMARY callout</Callout>
            <Callout variant={Variant.SECONDARY}>SECONDARY callout</Callout>
            <Callout variant={Variant.WARNING}>WARNING callout</Callout>
            <Callout variant={Variant.ERROR}>ERROR callout</Callout>
            <Callout variant={Variant.SUCCESS}>SUCCESS callout</Callout>
        </div>
    </div>
  )
}
