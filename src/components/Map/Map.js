// @flow strict
import React from "react";
import DeckGL from "@deck.gl/react";
import { MapView, MapController } from "@deck.gl/core";
import ReactMapGL, { NavigationControl } from "react-map-gl";

import { GeoJsonLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { rgb } from "d3-color";
import styles from "./Map.module.scss";

const Map = ({
  activityData: {
    stream: { latlng },
    activityData
  }
}) => {
  if (latlng === undefined) {
    return null;
  }

  const cll = centreLatLng(latlng);

  const geoData = {
    type: "Feature",
    properties: { name: "Walk", color: "#00aeef" },
    geometry: {
      type: "MultiLineString",
      coordinates: [swapLatLng(latlng)]
    }
  };

  const colorToRGBArray = color => {
    if (Array.isArray(color)) {
      return color.slice(0, 4);
    }
    const c = rgb(color);
    return [c.r, c.g, c.b, 255];
  };

  const geoLayer = new GeoJsonLayer({
    id: "geojson-layer",
    data: geoData,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: [160, 160, 180, 200],
    getLineColor: d => colorToRGBArray(d.properties.color),
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 50
    // onHover: ({ object, x, y }) => {
    //   const tooltip = object.properties.name || object.properties.station;
    //   /* Update tooltip
    //      http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
    //   */
    // }
  });

  // Initial viewport settings
  const initialViewState = {
    latitude: cll.lat,
    longitude: cll.lng,
    zoom: 12.8,
    pitch: 50,
    bearing: 0
  };

  return (
    <div className={styles["map"]}>
      {activityData && (
        <div className={styles["map__meta"]}>
          <div className={styles["map__meta__detail"]}>
            <span className={styles["map__meta__detail__value"]}>
              {activityData.distance} m
            </span>
            <span className={styles["map__meta__detail__title"]}>Distance</span>
          </div>
          <div className={styles["map__meta__detail"]}>
            <span className={styles["map__meta__detail__value"]}>
              {activityData.total_elevation_gain} m
            </span>
            <span className={styles["map__meta__detail__title"]}>
              Total Elevation Gain
            </span>
          </div>
          <div className={styles["map__meta__detail"]}>
            <span className={styles["map__meta__detail__value"]}>
              {activityData.max_speed} km/h
            </span>
            <span className={styles["map__meta__detail__title"]}>
              Max Speed
            </span>
          </div>
          <div className={styles["map__meta__detail"]}>
            <span className={styles["map__meta__detail__value"]}>
              {activityData.average_speed} km/h
            </span>
            <span className={styles["map__meta__detail__title"]}>
              Average Speed
            </span>
          </div>
        </div>
      )}
      <div className={styles["map__map"]}>
        <DeckGL
          width="100%"
          height="30vw"
          minHeight="100px"
          controller={true}
          initialViewState={initialViewState}
          layers={[geoLayer]}
        >
          <ReactMapGL
            width="100%"
            height="30vw"
            mapStyle={"mapbox://styles/mapbox/outdoors-v11"}
            mapboxApiAccessToken={process.env.GATSBY_MAPBOX_ACCESS_TOKEN}
          >
            <div style={{ position: "absolute", right: 8, top: 8 }}>
              <NavigationControl />
            </div>
          </ReactMapGL>
        </DeckGL>
      </div>
    </div>
  );
};

const swapLatLng = ll => {
  const newLL = ll.map(coord => {
    return [coord[1], coord[0]];
  });
  return newLL;
};

const centreLatLng = stream => {
  const lat = stream.map(ll => ll[0]);
  const lng = stream.map(ll => ll[1]);

  const maxLng = lng.reduce((accumulator, currentValue) => {
    return accumulator > currentValue ? accumulator : currentValue;
  });

  const maxLat = lat.reduce((accumulator, currentValue) => {
    return accumulator > currentValue ? accumulator : currentValue;
  });

  const minLng = lng.reduce((accumulator, currentValue) => {
    return accumulator < currentValue ? accumulator : currentValue;
  });

  const minLat = lat.reduce((accumulator, currentValue) => {
    return accumulator < currentValue ? accumulator : currentValue;
  });

  const centreLat = (maxLat - minLat) / 2 + minLat;
  const centreLng = (maxLng - minLng) / 2 + minLng;

  return { lat: centreLat, lng: centreLng };
};

export default Map;
