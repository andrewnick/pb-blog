// @flow strict
import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Page from "../components/Page";
import Pagination from "../components/Pagination";
import { useSiteMetadata } from "../hooks";
import DeckGL from "@deck.gl/react";
import { LineLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
// import ReactMapGL from "react-map-gl";

import bartStation from "../utils/bart-station";
// import { StaticMap } from “react-map-gl”;

import type { PageContext, AllMarkdownRemark } from "../types";

type Props = {
  data: AllMarkdownRemark,
  pageContext: PageContext
};

// Initial viewport settings
const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

const Gdata = [
  {
    sourcePosition: [-122.41669, 37.7853],
    targetPosition: [-122.41669, 37.781]
  }
];

const IndexTemplate = ({ data, pageContext }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();
  const {
    currentPage,
    hasNextPage,
    hasPrevPage,
    prevPagePath,
    nextPagePath
  } = pageContext;

  const { edges } = data.allMarkdownRemark;
  const pageTitle =
    currentPage > 0 ? `Posts - Page ${currentPage} - ${siteTitle}` : siteTitle;

  // Viewport settings
  // const viewState = {
  //   longitude: -122.41669,
  //   latitude: 37.7853,
  //   zoom: 13,
  //   pitch: 0,
  //   bearing: 0
  // };

  // const gData = [
  //   {
  //     sourcePosition: [-122.41669, 37.7853],
  //     targetPosition: [-122.41669, 37.781]
  //   }
  // ];

  // const layers = [
  //   new LineLayer({
  //     id: "line-layer",
  //     gData
  //   })
  // ];

  // const scatterplotLayer = new ScatterplotLayer({
  //   id: "bart-stations",
  //   data: bartStation,
  //   getRadius: d => Math.sqrt(d.entries) / 100,
  //   getPosition: d => d.coordinates,
  //   getFillColor: [255, 228, 0]
  // });

  // Set your mapbox access token here
  const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiYW5kcmV3bmljayIsImEiOiJjazN1b2R5ZHkwYWc2M25teWVpem11NG4yIn0.90W3HLPO7a3P72ksY9lbdw";

  const layers = [new LineLayer({ id: "line-layer", data: Gdata })];

  return (
    <Layout title={pageTitle} description={siteSubtitle}>
      <h1>PB's Trip Reports</h1>
      {/* <DeckGL viewState={viewState} layers={layers} /> */}
      {/* <DeckGL
        width="100%"
        height="100%"
        longitude={-122.4}
        latitude={37.78}
        zoom={8}
        controller={true}
        layers={[scatterplotLayer]}
      /> */}

      {/* <iframe
        style={{
          width: `${100}%`,
          height: `${600}px`
        }}
        src="https://veloviewer.com/segments/14827864/embed2"
        frameborder="0"
        scrolling="no"
      ></iframe> */}

      {/* <Sidebar isIndex /> */}
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap
          scrollZoom={false}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
      {/* <Page>
        <Feed edges={edges} />
        <Pagination
          prevPagePath={prevPagePath}
          nextPagePath={nextPagePath}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
        />
      </Page> */}
    </Layout>
  );
};

export const query = graphql`
  query IndexTemplate($postsLimit: Int!, $postsOffset: Int!) {
    allMarkdownRemark(
      limit: $postsLimit
      skip: $postsOffset
      filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            title
            date
            category
            description
          }
        }
      }
    }
  }
`;

export default IndexTemplate;
