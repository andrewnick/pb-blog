import React from "react";
import styles from "./Header.module.scss";
import Map from "../../Map";

const Header = ({ title }) => {
  return (
    <div className={styles["header"]}>
      <Map />
      <h1 className={styles["header__title"]}>{title}</h1>
    </div>
  );
};

export default Header;
