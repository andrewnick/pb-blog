// @flow strict
import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Page from "../components/Page";
import Pagination from "../components/Pagination";
import { useSiteMetadata } from "../hooks";
import Map from "../components/Map";
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

  console.log(data);

  // const { edges } = data.allMarkdownRemark;
  const pageTitle =
    currentPage > 0 ? `Posts - Page ${currentPage} - ${siteTitle}` : siteTitle;

  return (
    <Layout title={pageTitle} description={siteSubtitle}>
      <h1>PB's Trip Reports</h1>

      <Map />

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

// export const query = graphql`
//   query {
//     allStravaActivityStream {
//       edges {
//         node {
//           id
//           type
//         }
//       }
//     }
//   }
// `;

export default IndexTemplate;
