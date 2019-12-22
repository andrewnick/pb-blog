import React from "react";
import styles from "./Map.module.scss";
import { distanceConvert, speedConvert } from "../../utils/convert";

const ActivitySummary = ({ activityData }) => (
  <div className={styles["map__meta"]}>
    <div className={styles["map__meta__detail"]}>
      <span className={styles["map__meta__detail__value"]}>
        {distanceConvert(activityData.distance, "km")}
      </span>
      <span className={styles["map__meta__detail__title"]}>Distance</span>
    </div>
    <div className={styles["map__meta__detail"]}>
      <span className={styles["map__meta__detail__value"]}>
        {activityData.total_elevation_gain.toFixed(0)} m
      </span>
      <span className={styles["map__meta__detail__title"]}>Elevation</span>
    </div>
    <div className={styles["map__meta__detail"]}>
      <span className={styles["map__meta__detail__value"]}>
        {speedConvert(activityData.max_speed, "km/h")}
      </span>
      <span className={styles["map__meta__detail__title"]}>Max Speed</span>
    </div>
    <div className={styles["map__meta__detail"]}>
      <span className={styles["map__meta__detail__value"]}>
        {speedConvert(activityData.average_speed, "km/h")}
      </span>
      <span className={styles["map__meta__detail__title"]}>Average Speed</span>
    </div>
  </div>
);

export default ActivitySummary;
