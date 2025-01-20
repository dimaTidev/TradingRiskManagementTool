import ButtonIcon, { Size } from "@/lib/UIComponents/ButtonIcon";
import Styles from "./panelSetting.module.css";
import ToggleField from "../Components/toggleField";
import { APICredentialsSettingsRemoveButton } from "./creadentials/credentials";

export default function Settings({onClose, isAdvancedMode, setAdvancedMode}) {
    return (
      <div className={Styles.settingsOverlay}>
          <div className={Styles.panel} onClick={(e) => e.stopPropagation()}>
              <div className={Styles.header}>
                  <a className={Styles.headerFont}>Settings</a>
                  <ButtonIcon src="close.svg" quiet={true} size={Size.L} onClick={onClose}/>
              </div>
              <hr/>
  
              <ToggleField checked={isAdvancedMode ? "checked" : ""} onChange={() => setAdvancedMode?.((s) => !s)} label="Advanced mode"/>
      
              <APICredentialsSettingsRemoveButton onRemoveCredentials={() => onClose?.()}/>
          </div>
      </div>
    )
  }