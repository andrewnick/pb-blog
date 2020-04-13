import React from "react";
import { Marker } from "react-map-gl";
import styles from "./Marker.module.scss";

const StartMarker = ({ latLng }) => (
  <Marker
    latitude={latLng[0]}
    longitude={latLng[1]}
    offsetLeft={-5}
    offsetTop={-25}
  >
    <div className={styles["marker__start"]}>
       <svg viewBox="0 0 62 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path d="M32.9,0 C34.7,0.31 36.53,0.53 38.3,0.95 C43.5046131,2.17274846 48.2826675,4.77770368 52.13,8.49 C56.3372995,12.446071 59.3336907,17.5163534 60.77,23.11 C61.7084603,26.3551142 61.98728,29.7553551 61.59,33.11 C61.2241979,35.7669213 60.6149687,38.3845983 59.77,40.93 C58.48,44.78 56.98,48.56 55.4,52.31 C53.82,56.06 52.12,59.57 50.4,63.17 C47.9,68.44 45.31,73.71 42.83,79 C41.14,82.61 39.55,86.26 37.96,89.91 C36.96,92.2 36.05,94.52 35.12,96.84 C34.5630782,98.6091392 32.971497,99.8505725 31.12,99.96 C29.1954685,100.075178 27.4201113,98.9240333 26.74,97.12 C23.99,90.82 21.28,84.49 18.46,78.22 C16.39,73.62 14.14,69.09 12,64.53 C8.79,57.7 5.62,50.86 3,43.76 C1.74849348,40.4787962 0.853350628,37.0725597 0.33,33.6 C0.000858151773,30.902639 0.0885500215,28.1707 0.59,25.5 C2.77106504,13.1079359 12.2750444,3.29111721 24.59,0.71 C26.07,0.4 27.59,0.23 29.07,0 L32.9,0 Z M30.9,54.1601689 C40.6700051,54.1964219 49.498634,48.3402136 53.2645846,39.3251183 C57.0305352,30.310023 54.9911561,19.9138316 48.0984521,12.9896017 C41.2057481,6.06537186 30.8189713,3.97857257 21.7867845,7.70334493 C12.7545978,11.4281173 6.8581624,20.2299304 6.85,30 C6.90447002,43.2933062 17.6469078,54.066959 30.94,54.1601689 L30.9,54.1601689 Z" id="Shape"></path>
       </svg>
    </div>
  </Marker>
);

export default StartMarker;