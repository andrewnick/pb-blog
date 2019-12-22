const axios = require("axios");

const getAccessToken = ({ clientId, clientSecret, refreshToken }) =>
  axios
    .post("https://www.strava.com/oauth/token", {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret
    })
    .catch(err => {
      throw err;
    });

// const getAccessToken = ({ clientId, clientSecret, authCode }) =>
//   axios
//     .post("https://www.strava.com/oauth/token", {
//       grant_type: "authorization_code",
//       code: authCode,
//       client_id: clientId,
//       client_secret: clientSecret
//     })
//     .catch(err => {
//       console.log(err.response.data.errors);

//       throw err;
//     });

const capitalise = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const snakeToCamel = str =>
  str.replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace("-", "")
      .replace("_", "")
  );

const getActivityStream = async (id, strava, types) =>
  new Promise((resolve, reject) => {
    strava.activities.streams.get(
      id,
      {
        types
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          const latlng = res.find(stream => stream.type === "latlng");
          const distance = res.find(stream => stream.type === "distance");
          const altitude = res.find(stream => stream.type === "altitude");

          resolve({
            latlng: latlng.data,
            distance: distance.data,
            altitude: altitude.data
          });
        }
      }
    );
  });

const getActivity = async (id, strava) =>
  new Promise((resolve, reject) => {
    strava.activities.get(id, {}, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

const getStrava = async stravaConfig => {
  const { clientId, clientSecret, redirectURI } = stravaConfig;
  const response = await getAccessToken(stravaConfig);

  console.log({ clientId, clientSecret, redirectURI });

  return require("strava")({
    access_token: response.data.access_token,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectURI
  });
};

const getData = async (strava, activityID) => {
  let stream = {};
  let activityData = {};

  if (activityID) {
    try {
      stream = await getActivityStream(activityID, strava, [
        // "time",
        // "cadence",
        // "distance",
        "latlng",
        // "heartrate",
        // "temp",
        // "moving",
        // "grade_smooth",
        // "watts",
        // "velocity_smooth",
        "altitude"
      ]);

      activityData = await getActivity(activityID, strava);
    } catch (e) {
      stream = {};
      activityData = {};
    }
  }

  return {
    stream,
    activityData
  };
};

module.exports = {
  getStrava,
  getData
};
