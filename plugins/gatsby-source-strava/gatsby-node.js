const axios = require("axios");
const crypto = require("crypto");

const getAccessToken = config =>
  //   console.log(config);

  axios
    .post("https://www.strava.com/oauth/token", {
      grant_type: "authorization_code",
      code: "7212792ddb8041fdaa8bcfaae5e871f3eb31dc86",
      //   refresh_token: "0280d40d28ebea1b4d41261b348474b7c304a270",
      client_id: "41405",
      client_secret: "445b3a4945372f6e56d877ae7efafcfcf54e340e"
    })
    .catch(err => {
      throw err;
    });
// const getAccessToken = config => {
//   return axios
//     .post(`https://www.strava.com/oauth/token`, {
//       grant_type: 'refresh_token',
//       refresh_token: config.refresh_token,
//       client_id: config.id,
//       client_secret: config.secret,
//     })
//     .catch(err => {
//       throw err
//     })
// }

//www.strava.com/oauth/authorize?client_id=41405&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read_all,activity:read_all

http: const capitalise = s => {
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

const processWorkout = (workout, createNodeId, createContentDigest) => ({
  ...workout,
  id: createNodeId(`strava-${workout.id}`),
  parent: null,
  children: [],
  internal: {
    type: "StravaWorkout",
    content: JSON.stringify(workout),
    contentDigest: createContentDigest(workout)
  }
});

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;
  const response = await getAccessToken(configOptions);

  //   console.log(response.data.access_token);
  //   console.log(response.data.refresh_token);

  const strava = require("strava")({
    access_token: response.data.access_token,
    client_id: "41405",
    client_secret: "445b3a4945372f6e56d877ae7efafcfcf54e340e",
    redirect_uri: "pbs-trip-reports.netlify.com"
  });

  return getActivityStream(
    "2916113071",
    // "2918443419",
    strava,
    [
      "time",
      "cadence",
      "distance",
      "latlng",
      "heartrate",
      "temp",
      "moving",
      "grade_smooth",
      "watts",
      "velocity_smooth",
      "altitude"
    ],
    createNode,
    createNodeId,
    createContentDigest
  );
};

const getActivities = async (
  strava,
  createNode,
  createNodeId,
  createContentDigest
) =>
  new Promise((resolve, reject) => {
    strava.athlete.activities.get((err, res) => {
      if (err) reject(err);

      console.log(res);

      res.forEach(workout => {
        const nodeData = processWorkout(
          workout,
          createNodeId,
          createContentDigest
        );
        createNode(nodeData);
      });
      resolve();
    });
  });

const getActivityStream = async (
  id,
  strava,
  types,
  createNode,
  createNodeId,
  createContentDigest
) =>
  //   console.log(strava);

  new Promise((resolve, reject) => {
    strava.activities.streams.get(
      id,
      {
        types
      },
      (err, res) => {
        if (err) reject(err);

        res.forEach(type => {
          const nodeData = processActivityStreamType(
            type,
            createNodeId,
            createContentDigest
          );
          createNode(nodeData);
        });
        resolve();
      }
    );
  });
const processActivityStreamType = (type, createNodeId, createContentDigest) => {
  const obj = {
    ...type,
    id: createNodeId(`strava-${type.type}`),
    parent: null,
    children: [],
    internal: {
      type: `StravaActivityStream${capitalise(snakeToCamel(type.type))}`,
      content: JSON.stringify(type),
      contentDigest: createContentDigest(type)
    }
  };

  return obj;
};
