// @flow strict
import React from "react";
import { graphql } from "gatsby";
import DeckGL from "@deck.gl/react";
import { LineLayer, GeoJsonLayer, PathLayer } from "@deck.gl/layers";
// import { LineLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { rgb } from "d3-color";
import latlngData from "../../utils/latlng";
import walseyData from "../../utils/walsey";
import bartgeo from "../../utils/bartgeo";
import bartlines from "../../utils/bart-lines";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYW5kcmV3bmljayIsImEiOiJjazN1b2R5ZHkwYWc2M25teWVpem11NG4yIn0.90W3HLPO7a3P72ksY9lbdw";

const Map = () => {
  //   console.log(query);
  //   console.log(latlngData);

  //   const Gdata = [
  //     {
  //       sourcePosition: [-122.41669, 37.7853],
  //       targetPosition: [-122.41669, 37.781]
  //     }
  //   ];

  //   const geoData = [
  //     {
  //       path: latlngData,
  //       name: "Walk",
  //       color: "#ffe800"
  //     }
  //   ];

  const pathData = [
    {
      path: swapLatLng(latlngData),
      name: "Walk",
      color: "#ffe800"
    }
  ];

  //   const ll = swapLatLng([
  //     [-43.532971, 172.636801],
  //     [-43.533016, 172.636785],
  //     [-43.533072, 172.636769],
  //     [-43.488855, 172.587447]
  //   ]);

  //   console.log(ll);

  const geoData = {
    type: "Feature",
    properties: { name: "Walk", color: "#00aeef" },
    geometry: {
      type: "MultiLineString",
      coordinates: [swapLatLng(walseyData)]
      //   coordinates: [swapLatLng(latlngData)]
    }
  };

  //   console.log(geoData);

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
    // data: bartgeo,
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

  const pathLayer = new PathLayer({
    id: "path-layer",
    data: pathData,
    pickable: true,
    widthScale: 20,
    widthMinPixels: 2,
    getPath: d => d.path,
    getColor: d => colorToRGBArray(d.color),
    getWidth: d => 5
    // onHover: ({ object, x, y }) => {
    //   const tooltip = object.name;
    //   /* Update tooltip
    //      http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
    //   */
    // }
  });

  // Initial viewport settings
  const initialViewState = {
    latitude: -43.597399,
    longitude: 172.616482,
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
        // layers={[pathLayer]}
      >
        <StaticMap
          scrollZoom={false}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </div>
  );
};

// export const query = graphql`
//   query {
//     allStravaWorkout {
//       edges {
//         node {
//           id
//           name
//           distance
//           type
//           total_photo_count
//           total_elevation_gain
//           moving_time
//           start_date
//           elapsed_time
//           achievement_count
//           kudos_count
//           comment_count
//           photo_count
//           average_speed
//           max_speed
//           pr_count
//           total_elevation_gain
//         }
//       }
//     }
//   }
// `;

const swapLatLng = ll => {
  const newLL = ll.map(coord => {
    return [coord[1], coord[0]];
  });
  return newLL;
};

export default Map;
