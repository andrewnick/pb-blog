const axios = require("axios");

const getAccessToken = config => {
  //   console.log(config);

  return axios
    .post(`https://www.strava.com/oauth/token`, {
      grant_type: "authorization_code",
      code: "7212792ddb8041fdaa8bcfaae5e871f3eb31dc86",
      //   refresh_token: "0280d40d28ebea1b4d41261b348474b7c304a270",
      client_id: "41405",
      client_secret: "445b3a4945372f6e56d877ae7efafcfcf54e340e"
    })
    .catch(err => {
      throw err;
    });
};

const processWorkout = (workout, createNodeId, createContentDigest) => {
  return Object.assign({}, workout, {
    id: createNodeId(`strava-${workout.id}`),
    parent: null,
    children: [],
    internal: {
      type: `StravaWorkout`,
      content: JSON.stringify(workout),
      contentDigest: createContentDigest(workout)
    }
  });
};

const processActivityStreamType = (type, createNodeId, createContentDigest) => {
  return Object.assign({}, type, {
    id: createNodeId(`strava-${type.id}`),
    parent: "__SOURCE__",
    children: [],
    internal: {
      type: `StravaActivityStreamType`,
      content: JSON.stringify(type),
      contentDigest: createContentDigest(type)
    }
  });
};

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

  //   console.log(strava);

  //   return getActivities(strava, createNode, createNodeId, createContentDigest);
  return getActivityStream(
    "2916113071",
    strava,
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
) => {
  return new Promise((resolve, reject) => {
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
};

const getActivityStream = async (
  id,
  strava,
  createNode,
  createNodeId,
  createContentDigest
) => {
  //   console.log(strava);

  return new Promise((resolve, reject) => {
    strava.activities.streams.get(
      id,
      {
        types: [
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
        ]
      },
      (err, res) => {
        if (err) reject(err);

        // console.log(res);

        createNode({
          res,
          id: `Strava Activity: ${res.totalCount}`,
          parent: null,
          children: [],
          internal: {
            type: `StravaActivityStream`,
            content: JSON.stringify(res),
            contentDigest: createContentDigest(res)
          }
        });

        res.forEach(type => {
          //   console.log(type);
          //   console.log("--------");

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
};

// streams.get(id, params, callback)
