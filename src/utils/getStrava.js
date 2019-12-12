const axios = require("axios");

const getAccessToken = () =>
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
        console.log(err);
        console.log(res);

        if (err) {
          reject(err);
        } else {
          const latlng = res.find(stream => stream.type === "latlng");
          //   forEach(type => {
          //     //   console.log(type);
          //     //   const nodeData = processActivityStreamType(
          //     //     type,
          //     //     createNodeId,
          //     //     createContentDigest
          //     //   );
          //     //   createNode(nodeData);
          //     if (type.type == )
          //   });
          console.log(res);
          resolve(latlng.data);
        }
      }
    );
  });

const getActivity = async (id, strava) =>
  new Promise((resolve, reject) => {
    strava.activities.get(id, {}, (err, res) => {
      console.log(err);
      console.log(res);

      if (err) {
        reject(err);
      } else {
        // console.log(res);

        // const latlng = res.find(stream => stream.type === "latlng");
        //   forEach(type => {
        //     //   console.log(type);
        //     //   const nodeData = processActivityStreamType(
        //     //     type,
        //     //     createNodeId,
        //     //     createContentDigest
        //     //   );
        //     //   createNode(nodeData);
        //     if (type.type == )
        //   });
        // console.log(res);
        resolve(res);
      }
    });
  });

const getStrava = async activityID => {
  // console.log("a", activityID);
  const response = await getAccessToken();

  const strava = require("strava")({
    access_token: response.data.access_token,
    client_id: "41405",
    client_secret: "445b3a4945372f6e56d877ae7efafcfcf54e340e",
    redirect_uri: "pbs-trip-reports.netlify.com"
  });

  let stream = [];
  let activityData = [];

  if (activityID) {
    try {
      stream = await getActivityStream(
        // "2916113071",
        // // "2918443419",
        activityID,
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
        ]
      );

      activityData = await getActivity(activityID, strava);
    } catch (e) {
      stream = [];
      activityData = {};
    }
  }

  return {
    stream,
    activityData
  };
};

module.exports = getStrava;
