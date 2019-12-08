// @flow strict
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { rgb } from "d3-color";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYW5kcmV3bmljayIsImEiOiJjazN1b2R5ZHkwYWc2M25teWVpem11NG4yIn0.90W3HLPO7a3P72ksY9lbdw";

const Map = () => {
  const {
    stravaActivityStreamLatlng: { data }
  } = useStaticQuery(graphql`
    query ActivityStreamLatlng {
      stravaActivityStreamLatlng {
        data
        type
        series_type
      }
    }
  `);

  const geoData = {
    type: "Feature",
    properties: { name: "Walk", color: "#00aeef" },
    geometry: {
      type: "MultiLineString",
      coordinates: [swapLatLng(data)]
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
    // latitude: -43.597399,
    // longitude: 172.616482,
    latitude: -43.532971,
    longitude: 172.636801,
    // latitude: 37.893394,
    // longitude: -122.123801,
    // latitude: 172.587447,
    // longitude: -43.488855,
    zoom: 14,
    pitch: 50,
    bearing: 180
  };

  return (
    <div>
      <h1>Strava Data</h1>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={[geoLayer]}
      >
        <StaticMap
          scrollZoom={false}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </div>
  );
};

const swapLatLng = ll => {
  const newLL = ll.map(coord => {
    return [coord[1], coord[0]];
  });
  return newLL;
};

export default Map;
