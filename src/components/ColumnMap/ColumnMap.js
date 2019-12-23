// @flow strict
import React from "react";
import DeckGL from "@deck.gl/react";
import {
  GeoJsonLayer,
  PathLayer,
  ColumnLayer,
  GridCellLayer
} from "@deck.gl/layers";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { StaticMap } from "react-map-gl";
import hex from "../../utils/hex2";
import { rgb } from "d3-color";

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

const ColumnMap = ({
  activityData: {
    stream: { latlng, altitude, distance }
  }
}) => {
  // console.log(activityData);
  console.log(latlng, altitude, distance);

  if (latlng === undefined) {
    return null;
  }

  const cll = centreLatLng(latlng);

  const pathAlt = addAltitude(swapLatLng(latlng), altitude, distance);
  const columnData = addSlope(pathAlt);

  const colorToRGBArray = color => {
    if (Array.isArray(color)) {
      return color.slice(0, 4);
    }
    const c = rgb(color);
    return [c.r, c.g, c.b, 255];
  };

  const data = columnData;
  console.log(data);

  const elevationScale = 1;

  const layer = new GridCellLayer({
    id: "column-layer",
    data,
    diskResolution: 12,
    // radius: 4,
    cellSize: 4,
    material,
    extruded: true,
    pickable: true,
    elevationScale,
    getPosition: d => d.centroid,
    getFillColor: d => {
      return [48, 128, d.slope * 255, 255];
      // return [48, 128, (d.altitude * 255) / colorScale.max - 255, 255];
    },
    getLineColor: [0, 0, 0],
    getElevation: d => d.altitude
    // onHover: ({ object, x, y }) => {
    //   const tooltip = `height: ${object.altitude * 4}m`;
    //   /* Update tooltip
    //      http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
    //   */
    // }
  });

  const initialViewState = {
    latitude: cll.lat,
    longitude: cll.lng,
    zoom: 12.8,
    pitch: 50,
    bearing: 0
  };

  return (
    <DeckGL
      height={500}
      width={500}
      controller={true}
      initialViewState={initialViewState}
      layers={[layer]}
    >
      <StaticMap
        // reuseMaps
        // mapStyle={mapStyle}
        // preventStyleDiffing={true}
        mapboxApiAccessToken={process.env.GATSBY_MAPBOX_ACCESS_TOKEN}
      />
    </DeckGL>
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

export default ColumnMap;
