import React from "react";
import styles from "./Header.module.scss";
import Map from "../../Map";

const Header = ({ title, activityData }) => {
  return (
    <div className={styles["header"]}>
      {activityData.stream.length && <Map activityData={activityData} />}
      <div className={styles["header__meta"]}>
        <h1 className={styles["header__title"]}>{title}</h1>
        <p>Type: {activityData.activityData.type}</p>
        <p>Distance: {activityData.activityData.distance}m</p>

        <p>
          Total Elevation Gain: {activityData.activityData.total_elevation_gain}
          m
        </p>
        <p>Max Speed: {activityData.activityData.max_speed}km/hr</p>
        <p>Average Speed: {activityData.activityData.average_speed}km/hr</p>
      </div>
    </div>
  );
};

export default Header;
