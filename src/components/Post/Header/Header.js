import React from "react";
import styles from "./Header.module.scss";
import Map from "../../Map";

const Header = ({ title, activityData }) => {
  return (
    <div className={styles["header"]}>
      {activityData.length && <Map activityData={activityData} />}
      <h1 className={styles["header__title"]}>{title}</h1>
    </div>
  );
};

export default Header;
