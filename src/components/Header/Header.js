import React from "react";
import styles from "./Header.module.scss";
import HeaderMap from "../HeaderMap";
import HeaderDefaultBackground from "./HeaderDefaultBackground";

const Header = ({ title, activityData }) => {
  console.log(activityData);
  console.log(Object.keys(activityData).length);
  console.log(Object.keys(activityData.stream).length === 0);

  return (
    <div className={styles["header"]}>
      <HeaderDefaultBackground />
      {/* {Object.keys(activityData.stream).length !== 0 && ( */}
      <div className={styles["header__map"]}>
        <HeaderMap activityData={activityData} />
      </div>
      {/* )} */}
      {/* <div className={styles["header__title-container"]}> */}
      <h1 className={styles["header__title"]}>{title}</h1>
      {/* </div> */}
    </div>
  );
};

export default Header;
