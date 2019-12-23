// @flow strict
import React from "react";
import DeckGL from "@deck.gl/react";
import { GridCellLayer } from "@deck.gl/layers";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import FinishMarker from "../Map/FinishMarker";
import StartMarker from "../Map/StartMarker";
import ReactMapGL from "react-map-gl";
import styles from "../Map/Map.module.scss";

import { color as d3Color, rgb, hsl } from "d3-color";

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
  pointLight2
});

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
};

const ElevationMap = ({
  activityData: {
    stream: { latlng, altitude, distance }
  },
  zoom
}) => {
  if (latlng === undefined) {
    return null;
  }

  const cll = centreLatLng(latlng);
  const startll = latlng[0];
  const endll = latlng[latlng.length - 1];
  const pathAlt = addAltitude(swapLatLng(latlng), altitude, distance);
  const columnData = addSlope(pathAlt);

  // const colorToRGBArray = color => {
  //   if (Array.isArray(color)) {
  //     return color.slice(0, 4);
  //   }
  //   const c = rgb(color);
  //   return [c.r, c.g, c.b, 255];
  // };

  const createColor = value => {
    return rgb(`hsl(${value}, 100%, 40%)`);
  };

  const data = columnData;

  const minMaxSlope = data => {
    const slope = data.map(d => d.slope);

    return {
      min: Math.min(...slope),
      max: Math.max(...slope)
    };
  };

  const minMax = minMaxSlope(data);
  const calcColor = (minMax, value) => {
    const offset = minMax.min;
    const range = minMax.max - minMax.min;
    const factor = 10;

    return (value - offset) * factor;
  };

  const elevationScale = 1;

  const layer = new GridCellLayer({
    id: "column-layer",
    data,
    diskResolution: 12,
    cellSize: 4,
    material,
    extruded: true,
    pickable: true,
    elevationScale,
    getPosition: d => d.centroid,
    getFillColor: d => {
      const color = createColor(d.altitude);
      return [color.r, color.g, color.b, 255];
    },
    getLineColor: [0, 0, 0],
    getElevation: d => d.altitude
    // onHover: ({ object, x, y }) => {
    //   console.log(object, x, y);
    //   const tooltip = `height: ${object.altitude * 4}m`;
    //   /* Update tooltip
    //      http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
    //   */
    // }
  });

  const initialViewState = {
    latitude: cll.lat,
    longitude: cll.lng,
    zoom,
    pitch: 50,
    bearing: 0
  };

  return (
    <div className={styles["map__map"]}>
      <DeckGL
        width="100%"
        height="30vw"
        minHeight="100px"
        controller={true}
        effects={[lightingEffect]}
        initialViewState={initialViewState}
        layers={[layer]}
      >
        <ReactMapGL
          width="100%"
          height="30vw"
          reuseMaps
          mapStyle={"mapbox://styles/mapbox/outdoors-v11"}
          preventStyleDiffing={true}
          mapboxApiAccessToken={process.env.GATSBY_MAPBOX_ACCESS_TOKEN}
        >
          <StartMarker latLng={startll} />
          <FinishMarker latLng={endll} />
        </ReactMapGL>
      </DeckGL>
    </div>
  );
};

const addAltitude = (latlng, altitude, distance) => {
  const withAlt = latlng.map((ll, index) => {
    return {
      id: index,
      centroid: ll,
      altitude: altitude[index],
      distance: distance[index]
    };
  });

  return withAlt;
};

const addSlope = data => {
  return data.map(d => {
    const current = data[d.id];
    const neighbour = d.id === 0 ? data[d.id + 1] : data[d.id - 1];

    const rise = parseFloat(neighbour.altitude) - parseFloat(current.altitude);
    const run = parseFloat(neighbour.distance) - parseFloat(current.distance);

    const slope = run === 0 ? 0 : rise / run;

    return {
      ...d,
      slope
    };
  });
};

const swapLatLng = ll => {
  const newLL = ll.map(coord => {
    return [coord[1], coord[0]];
  });
  return newLL;
};

const centreLatLng = stream => {
  const lat = stream.map(latlng => latlng[0]);
  const lng = stream.map(latlng => latlng[1]);

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

export default ElevationMap;
