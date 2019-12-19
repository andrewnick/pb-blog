// @flow strict
import React from "react";
import { Location } from "@reach/router";
import queryString from "query-string";
import type { Edges } from "../../types";

const Auth = () => {
  const getCode = paramHash =>
    paramHash && paramHash.code ? paramHash.code : "";

  const clientID = process.env.GATSBY_STRAVA_CLIENT_ID;
  const redirectUri = process.env.GATSBY_STRAVA_REDIRECT_URI;
  const scope = "read_all,activity:read_all";
  const responseType = "code";

  return (
    <Location>
      {({ location, navigate }) =>
        location.search ? (
          <div>
            <h3>Code: {getCode(queryString.parse(location.search))} </h3>
            <h4>
              Next Step:{" "}
              <a href="https://developers.strava.com/docs/getting-started/">
                Get the refresh token and add to environment variables
              </a>
            </h4>
          </div>
        ) : (
          <a
            href={`http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=${responseType}&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`}
          >
            Get auth code
          </a>
        )
      }
    </Location>
  );
};

export default Auth;
