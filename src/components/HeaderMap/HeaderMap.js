// @flow strict
import React from "react";
import DeckGL from "@deck.gl/react";
import { WebMercatorViewport } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { rgb } from "d3-color";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYW5kcmV3bmljayIsImEiOiJjazN1b2R5ZHkwYWc2M25teWVpem11NG4yIn0.90W3HLPO7a3P72ksY9lbdw";

const HeaderMap = ({
  activityData: {
    stream: { latlng }
  }
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
      // properties: { name: "Walk", color: "#d2deff" },
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

    const { lat, lng } = latLngArray(latlng);
    const maxLL = maxLatLng(lat, lng);
    const minLL = minLatLng(lat, lng);

    const zoom = haversineDistance(
      maxLL.lat,
      maxLL.lng,
      minLL.lat,
      minLL.lng,
      "N"
    );
    console.log(zoom);

    // Initial viewport settings
    initialViewState = {
      latitude: cll.lat,
      longitude: cll.lng,
      zoom: 11,
      // pitch: 50,
      // zoom: zoom / 0,
      pitch: 0,
      bearing: 0
    };

    // const { lat, lng } = latLngArray(latlng);
    // const maxLL = maxLatLng(lat, lng);
    // const minLL = minLatLng(lat, lng);

    //   viewport = new WebMercatorViewport({
    //     width: 300,
    //     height: 250
    //   }).fitBounds(
    //     [
    //       [minLL.lng, minLL.lat],
    //       [maxLL.lng, maxLL.lat]
    //     ],
    //     {
    //       padding: 20,
    //       offset: [0, -100]
    //     }
    //   );
  }

  // -37.8958211, 175.4628788;

  return (
    <DeckGL
      height={250}
      controller={true}
      initialViewState={initialViewState}
      // viewport={viewport}
      layers={layers}
    >
      <StaticMap
        // mapStyle={"mapbox://styles/andrewnick/ck45eszle09lx1cpdvqg9owoi"}
        mapStyle={"mapbox://styles/andrewnick/ck45eszle09lx1cpdvqg9owoi/draft"}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      />
    </DeckGL>
  );
};

const haversineDistance = (lat1, lon1, lat2, lon2, unit) => {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const radlon1 = (Math.PI * lon1) / 180;
  const radlon2 = (Math.PI * lon2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;

  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
};

const swapLatLng = ll => {
  const newLL = ll.map(coord => {
    return [coord[1], coord[0]];
  });
  return newLL;
};

const latLngArray = latlng => {
  return { lat: latlng.map(ll => ll[0]), lng: latlng.map(ll => ll[1]) };
};

const centreLatLng = latlng => {
  const { lat, lng } = latLngArray(latlng);

  const maxLL = maxLatLng(lat, lng);
  const minLL = minLatLng(lat, lng);

  const centreLat = (maxLL.lat - minLL.lat) / 2 + minLL.lat;
  const centreLng = (maxLL.lng - minLL.lng) / 2 + minLL.lng;

  return { lat: centreLat, lng: centreLng };
};

const maxLatLng = (lat, lng) => {
  const maxLng = lng.reduce((accumulator, currentValue) => {
    return accumulator > currentValue ? accumulator : currentValue;
  });

  const maxLat = lat.reduce((accumulator, currentValue) => {
    return accumulator > currentValue ? accumulator : currentValue;
  });

  return { lat: maxLat, lng: maxLng };
};

const minLatLng = (lat, lng) => {
  const minLng = lng.reduce((accumulator, currentValue) => {
    return accumulator < currentValue ? accumulator : currentValue;
  });

  const minLat = lat.reduce((accumulator, currentValue) => {
    return accumulator < currentValue ? accumulator : currentValue;
  });

  return { lat: minLat, lng: minLng };
};

export default HeaderMap;
