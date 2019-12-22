import DeckGL from "@deck.gl/react";
import { PathLayer } from "@deck.gl/layers";

const GeoJson = ({ data, viewport }) => {
  // USE PLAIN JSON OBJECTS
  const PATH_DATA = [
    {
      path: [
        [-122.4, 37.7],
        [-122.5, 37.8],
        [-122.6, 37.85]
      ],
      name: "Richmond - Millbrae",
      color: [255, 0, 0]
    }
  ];

  new PathLayer({
    data: PATH_DATA,
    getPath: d => d.path,
    getColor: d => d.color
  });

  return <DeckGL {...viewport} layers={[layer]} />;
};

export default GeoJson;
