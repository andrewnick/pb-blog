// @flow strict
import React from "react";
import { rgb } from "d3-color";
import styles from "./Map.module.scss";
import ElevationMap from "./ElevationMap";
import { swapLatLng, centreLatLng } from "../../utils/latlng";
import ActivitySummary from "./ActivitySummary";

const Map = ({ activityData, zoom }) => {
  const {
    stream: { latlng },
    activityData: activityD
  } = activityData;

  if (latlng === undefined) {
    return null;
  }

  const cll = centreLatLng(latlng);
  const startll = latlng[0];
  const endll = latlng[latlng.length - 1];

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

  // const geoLayer = new GeoJsonLayer({
  //   id: "geojson-layer",
  //   data: geoData,
  //   pickable: true,
  //   stroked: false,
  //   filled: true,
  //   extruded: true,
  //   lineWidthScale: 20,
  //   lineWidthMinPixels: 2,
  //   getFillColor: [160, 160, 180, 200],
  //   getLineColor: d => colorToRGBArray(d.properties.color),
  //   getRadius: 100,
  //   getLineWidth: 1,
  //   getElevation: 50
  //   // onHover: ({ object, x, y }) => {
  //   //   const tooltip = object.properties.name || object.properties.station;
  //   //   /* Update tooltip
  //   //      http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
  //   //   */
  //   // }
  // });

  // const [viewport, setViewport] = useState({
  //   latitude: cll.lat,
  //   longitude: cll.lng,
  //   zoom,
  //   pitch: 50,
  //   bearing: 0
  // });

  return (
    <div className={styles["map"]}>
      <ActivitySummary activityData={activityD} />
      {/* <div className={styles["map__map"]}>
        <DeckGL
          width="100%"
          height="30vw"
          minHeight="100px"
          controller={true}
          initialViewState={viewport}
          // onViewportChange={viewport => setViewport(viewport)}
          layers={[geoLayer]}
        >
          <ReactMapGL
            width="100%"
            height="30vw"
            mapStyle={"mapbox://styles/mapbox/outdoors-v11"}
            mapboxApiAccessToken={process.env.GATSBY_MAPBOX_ACCESS_TOKEN}
          >
            <StartMarker latLng={startll} />
            <FinishMarker latLng={endll} />
            <div style={{ position: "absolute", right: 8, top: 8 }}>
              <NavigationControl />
            </div>
          </ReactMapGL>
        </DeckGL>
      </div> */}
      <ElevationMap activityData={activityData} zoom={zoom} />
    </div>
  );
};

export default Map;
