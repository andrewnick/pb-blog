import React, { Component } from "react";
import DeckGL from "@deck.gl/react";
import { OrbitView } from "@deck.gl/core";
import PlotLayer from "../../utils/plot-layer";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";

const xy = [
  [0, 0],
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
  [6, 6]
];

const z = [0, 1, 2, 3, 4, 5, 6];

const addElevationToLL = (xy, z) => {
  return xy.map((xy, index) => [xy[0], xy[1], z[index]]);
};

const data = addElevationToLL(xy, z);

// console.log(addElevationToLL(xy, z));
const pathVectors = addElevationToLL(xy, z);

const generateMatrix = (xMax, yMax, line) => {
  // const array = [];
  // const xArray = [];
  // const xArray = new Array(8);
  // // const yArray = new Array(8);
  // const arr = [[], []];
  // // console.log(array);

  // // array.map(item => 5);

  // // console.log(array);

  // arr[0][0] = 2;
  // arr[1][3] = 2;

  // console.log(array[5][5]);
  // for (let x = 0; x < xMax; x++) {
  //   arr[x];
  //   for (let y = 0; y < yMax; y++) {
  //     // console.log(array[x][y]);
  //     console.log(x, y);
  //     // array.push(xArray);
  //     // array. = 5;

  //     if (line[0] === x && line[1] === y) {
  //       array[x][y] = line;
  //     } else {
  //       array[x][y] = [0, 0, 0];
  //     }
  //   }
  // }

  // const rows = 6;
  // const columns = 6;

  const myArray1 = [];

  for (let i = 0; i < xMax; i++) {
    myArray1[i] = [];
    for (let j = 0; j < yMax; j++) {
      if (line[i][0] === i && line[i][1] === j) {
        myArray1[i][j] = line[i];
      } else {
        myArray1[i][j] = [0, 0, 0];
      }
    }
  }

  // console.log(myArray1);

  return myArray1;
};

const matrix = generateMatrix(7, 7, pathVectors);
// console.log(matrix);

// const d =
// const Dline = line()
//   .x(function(d) {
//     return x(d.date);
//   })
//   .y(function(d) {
//     return y(d.value);
//   });

// console.log(Dline);

const EQUATION = (x, y) => (Math.sin(x * x + y * y) * x) / Math.PI;

const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],
  orbitAxis: "Y",
  rotationX: 30,
  rotationOrbit: -30,
  /* global window */
  zoom: Math.log2(window.innerHeight / 3) // fit 3x3x3 box in current viewport
};

function getScale({ min, max }) {
  return scaleLinear()
    .domain([min, max])
    .range([0, 1]);
}

// console.log(getScale({ min: -43.597399, max: -43.6 }));

export class ElevationMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverInfo: null
    };

    this._onHover = this._onHover.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
  }

  _onHover(info) {
    const hoverInfo = info.sample ? info : null;
    if (hoverInfo !== this.state.hoverInfo) {
      this.setState({ hoverInfo });
    }
  }

  _renderTooltip() {
    const { hoverInfo } = this.state;
    return (
      hoverInfo && (
        <div
          className="tooltip"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}
        >
          {hoverInfo.sample.map(x => x.toFixed(3)).join(", ")}
        </div>
      )
    );
  }

  render() {
    const { resolution = 8, showAxis = true, equation = EQUATION } = this.props;

    const layers = [
      equation &&
        resolution &&
        new PlotLayer({
          getPosition: (u, v) => {
            console.log(u, v);
            const i = u * 10;
            const j = v * 10;
            console.log(i, j);
            // console.log(matrix[i][j]);
            const x = 1; //matrix[i][j][0];
            const y = 2; //matrix[i][j][1];
            const z = 3; //matrix[i][j][2];
            // data;
            return [x, y, z];
          },
          getColor: (x, y, z) => [40, z * 128 + 128, 160],
          getXScale: getScale,
          getYScale: getScale,
          getZScale: getScale,
          uCount: resolution,
          vCount: resolution,
          drawAxes: showAxis,
          axesPadding: 0.25,
          axesColor: [0, 0, 0, 128],
          opacity: 1,
          pickable: true,
          onHover: this._onHover,
          updateTriggers: {
            getPosition: equation
          }
        })
    ];

    return (
      <DeckGL
        layers={layers}
        views={new OrbitView()}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        {this._renderTooltip}
      </DeckGL>
    );
  }
}

export default ElevationMap;
