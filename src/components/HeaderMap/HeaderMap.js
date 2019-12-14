// @flow strict
import React from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { rgb } from "d3-color";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYW5kcmV3bmljayIsImEiOiJjazN1b2R5ZHkwYWc2M25teWVpem11NG4yIn0.90W3HLPO7a3P72ksY9lbdw";

const Map = ({
  activityData: {
    stream: { latlng }
  }
}) => {
  console.log(latlng);

  const cll = centreLatLng(latlng);

  const geoData = {
    type: "Feature",
    properties: { name: "Walk", color: "#d2deff" },
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
    lineWidthMinPixels: 4,
    getFillColor: [160, 160, 180, 200],
    getLineColor: d => colorToRGBArray(d.properties.color),
    getRadius: 100,
    getLineWidth: 1,
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
      height={250}
      // controller={true}
      initialViewState={initialViewState}
      layers={[geoLayer]}
    >
      <StaticMap
        mapStyle={"mapbox://styles/andrewnick/ck45eszle09lx1cpdvqg9owoi"}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      />
    </DeckGL>
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
