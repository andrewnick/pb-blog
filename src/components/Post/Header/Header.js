import React from "react";
import styles from "./Header.module.scss";
import HeaderMap from "../../HeaderMap";

const Header = ({ title, activityData }) => {
  return (
    <div className={styles["header"]}>
      {<HeaderMap activityData={activityData} />}
      <h1 className={styles["header__title"]}>{title}</h1>
    </div>
  );
};

export default Header;
