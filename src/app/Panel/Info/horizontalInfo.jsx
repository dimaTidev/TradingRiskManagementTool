import Styles from "./infoStyles.module.css";

export function HorizontalInfo({ label, value }) {
    return (
        <div className={Styles.horizontalInfo}>
            <div className={Styles.horizontalLabel}>{label}</div>
            <div className={Styles.horizontalValue}>{value}</div>
        </div>
    )
}