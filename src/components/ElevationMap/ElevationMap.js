// @flow strict
import React from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer, PathLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { rgb } from "d3-color";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYW5kcmV3bmljayIsImEiOiJjazN1b2R5ZHkwYWc2M25teWVpem11NG4yIn0.90W3HLPO7a3P72ksY9lbdw";

const ElevationMap = ({
  activityData: {
    stream: { latlng, altitude }
  }
}) => {
  // console.log(activityData);
  console.log(latlng, altitude);

  if (latlng === undefined) {
    return null;
  }

  const cll = centreLatLng(latlng);

  const pathAlt = addAltitude(swapLatLng(latlng), altitude);

  const pathData = [
    {
      path: pathAlt,
      name: "Bike Ride",
      color: [255, 0, 0]
    }
  ];

  const colorToRGBArray = color => {
    if (Array.isArray(color)) {
      return color.slice(0, 4);
    }
    const c = rgb(color);
    return [c.r, c.g, c.b, 255];
  };

  const geoLayer = new PathLayer({
    id: "path-layer",
    data: pathData,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 3,
    getFillColor: [160, 160, 180, 200],
    getLineColor: d => colorToRGBArray(d.properties.color),
    getRadius: 100,
    getLineWidth: 3,
    getElevation: 30
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
    bearing: 180
  };

  return (
    <DeckGL
      height={500}
      width={500}
      controller={true}
      initialViewState={initialViewState}
      layers={[geoLayer]}
    >
      {/* <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} /> */}
    </DeckGL>
  );
};

const addAltitude = (latlng, altitude) => {
  const withAlt = latlng.map((ll, index) => [ll[0], ll[1], altitude[index]]);

  console.log(withAlt);

  return withAlt;
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
