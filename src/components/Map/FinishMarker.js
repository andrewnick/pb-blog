import React from "react";
import { Marker } from "react-map-gl";
import styles from "./Marker.module.scss";

const FinishMarker = ({ latLng }) => (
  <Marker
    latitude={latLng[0]}
    longitude={latLng[1]}
    offsetLeft={-5}
    offsetTop={-20}
  >
    <div className={styles["marker__finish"]}>
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125">
         <path d="M34.4 92.9c0.5 2.3-1.1 4.5-3.5 4.9l0 0c-2.4 0.5-4.8-1-5.3-3.3L6.5 7.1C6 4.9 7.6 2.7 10 2.2l0 0c2.4-0.5 4.8 1 5.3 3.3L34.4 92.9z"/><path d="M78.8 9.4c-16.8 1.5-19.8-6.2-35.8-6C33.8 3.6 24.7 5.8 20.2 7.5l11.4 52.2c2.8-0.9 6.8-1.7 12.3-1.3 7.3 0.5 10 5.4 26.3 4.3 11.7-0.8 18.2-7.3 18.2-7.3l5.2-51.3C93.6 4 90.3 8.4 78.8 9.4z"/>
       </svg>
    </div>
  </Marker>
);

export default FinishMarker;
