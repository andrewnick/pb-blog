// @flow strict
import React from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { rgb } from "d3-color";
import { swapLatLng, centreLatLng } from "../../utils/latlng";

const HeaderMap = ({
  activityData: {
    stream: { latlng }
  },
  zoom
}) => {
  const cambridgeLL = {
    lat: -37.8958211,
    lng: 175.4628788
  };

  // Initial viewport settings
  let initialViewState = {
    latitude: cambridgeLL.lat,
    longitude: cambridgeLL.lng,
    zoom: 7,
    pitch: 40,
    bearing: 0
  };

  const layers = [];
  let viewport = {};

  if (latlng !== undefined) {
    const cll = centreLatLng(latlng);

    const geoData = {
      type: "Feature",
      properties: { name: "Walk", color: "#cdfffd" },
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

    layers.push(geoLayer);

    // Initial viewport settings
    initialViewState = {
      latitude: cll.lat,
      longitude: cll.lng,
      zoom,
      pitch: 40,
      bearing: 0
    };
  }

  return (
    <DeckGL
      height={250}
      controller={true}
      initialViewState={initialViewState}
      layers={layers}
    >
      <StaticMap
        mapStyle={"mapbox://styles/andrewnick/ck4htsbki3mkx1ck9zlh2l4yo"}
        mapboxApiAccessToken={process.env.GATSBY_MAPBOX_ACCESS_TOKEN}
      />
    </DeckGL>
  );
};

export default HeaderMap;
