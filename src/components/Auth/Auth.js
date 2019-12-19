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
            <h3>
              Authorisation Code: {getCode(queryString.parse(location.search))}{" "}
            </h3>
            <h4>
              Next Step: Using a http client with POST capabilities get your
              refresh token using the following URL
            </h4>
            <p>{`https://www.strava.com/oauth/token?client_secret=[client_secret_id]&code=${getCode(
              queryString.parse(location.search)
            )}0&grant_type=authorization_code&client_id=${clientID}`}</p>

            <a href="https://developers.strava.com/docs/getting-started/">
              Example here
            </a>
          </div>
        ) : (
          <a
            href={`http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=${responseType}&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`}
          >
            Get you auth code
          </a>
        )
      }
    </Location>
  );
};

export default Auth;
