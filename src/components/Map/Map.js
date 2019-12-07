// @flow strict
import React from "react";
import { graphql } from "gatsby";

const Map = ({ query }) => {
  console.log(query);

  return (
    <div>
      <h1>Strava Data</h1>
    </div>
  );
};

export const query = graphql`
  query {
    allStravaActivity {
      edges {
        node {
          id
          name
          distance
          type
          total_photo_count
          total_elevation_gain
          moving_time
          start_date
          elapsed_time
          achievement_count
          kudos_count
          comment_count
          photo_count
          average_speed
          max_speed
          pr_count
          total_elevation_gain
        }
      }
    }
  }
`;

export default Map;
