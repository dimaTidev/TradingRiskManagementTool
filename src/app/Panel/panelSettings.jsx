import ButtonIcon from "@/lib/UIComponents/ButtonIcon";
import Styles from "./panelSetting.module.css";
import { APICredentialsSettingsRemoveButton } from "./creadentials/credentials";
import { Size } from "@/lib/UIComponents/uiCommon";

export default function Settings({onClose, isAdvancedMode}) {
    return (
      <div className={Styles.settingsOverlay}>
          <div className={Styles.panel} onClick={(e) => e.stopPropagation()}>
              {/* <div className={Styles.header}>
                  <a className={Styles.headerFont}>Settings</a>
                  <ButtonIcon src="close.svg" quiet={true} size={Size.L} onClick={onClose}/>
              </div> */}
              {/* <hr/> */}
      
              <APICredentialsSettingsRemoveButton onRemoveCredentials={() => onClose?.()}/>
          </div>
      </div>
    )
  }