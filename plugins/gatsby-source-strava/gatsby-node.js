var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

const crypto = require("crypto")

const getActivities = require("./utils/activities.js")
const getAthlete = require("./utils/athlete.js")

exports.sourceNodes = async (
  {actions: {createNode}},
  {activitiesOptions, athleteOptions, debug, token}
) => {
  if (!token) {
    throw new Error("source-strava: Missing API token")
  }

  try {
    let heartrateMax
    const activities = await getActivities({
      debug,
      options: _extends({}, activitiesOptions),
      token,
    })

    if (activities && activities.length > 0) {
      activities.forEach(activity => {
        if (athleteOptions.computeHeartrateMax && activity.has_heartrate) {
          if (!heartrateMax || activity.max_heartrate > heartrateMax) {
            heartrateMax = activity.max_heartrate
          }
        }

        createNode({
          activity,
          id: `Strava Activity: ${activity.id}`,
          parent: "__SOURCE__",
          children: [],
          internal: {
            type: "StravaActivity",
            contentDigest: crypto
              .createHash("md5")
              .update(JSON.stringify(activity))
              .digest("hex"),
          },
        })
      })
    }

    const athlete = await getAthlete({
      token,
      options: athleteOptions,
    })

    createNode({
      athlete: _extends(
        {},
        athlete,
        athleteOptions.computeheartrateMax ? {heartrateMax} : {}
      ),
      id: `Strava Athlete: ${athlete.id}`,
      parent: "__SOURCE__",
      children: [],
      internal: {
        type: "StravaAthlete",
        contentDigest: crypto
          .createHash("md5")
          .update(JSON.stringify(athlete))
          .digest("hex"),
      },
    })
  } catch (e) {
    if (debug) {
      // eslint-disable-next-line
      console.error(e)
    }
    throw new Error(`source-strava: ${e.message}`)
  }
}
