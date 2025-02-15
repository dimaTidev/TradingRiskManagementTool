import ButtonIcon from "@/lib/UIComponents/ButtonIcon";
import Styles from "./panelSetting.module.css";
import { Size } from "@/lib/UIComponents/uiCommon";
import AccountList, { AccountCreationButton } from "../Accounts/accountList";

export default function Settings({onClose, isAdvancedMode}) {
    return (
      <div className={Styles.settingsOverlay}>
          <div className={Styles.base} onClick={(e) => e.stopPropagation()}>
              {/* <div className={Styles.header}>
                  <a className={Styles.headerFont}>Settings</a>
                  <ButtonIcon src="close.svg" quiet={true} size={Size.L} onClick={onClose}/>
              </div> */}
              {/* <hr/> */}

              <AccountList/>
              <AccountCreationButton/>
      
          </div>
      </div>
    )
  }