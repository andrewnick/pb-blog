"use strict";

const path = require("path");
const _ = require("lodash");
const dotenv = require("dotenv");
const createCategoriesPages = require("./pagination/create-categories-pages.js");
const createTagsPages = require("./pagination/create-tags-pages.js");
const createPostsPages = require("./pagination/create-posts-pages.js");
const { getStrava, getData } = require("../src/utils/getStrava");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const stravaConfig = {
  clientId: process.env.GATSBY_STRAVA_CLIENT_ID,
  clientSecret: process.env.GATSBY_STRAVA_CLIENT_SECRET,
  refreshToken: process.env.GATSBY_STRAVA_REFRESH_TOKEN,
  redirectURI: process.env.GATSBY_STRAVA_REDIRECT_URI,
  authCode: process.env.GATSBY_STRAVA_CODE
};

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  // 404
  createPage({
    path: "/404",
    component: path.resolve("./src/templates/not-found-template.js")
  });

  // Tags list
  createPage({
    path: "/tags",
    component: path.resolve("./src/templates/tags-list-template.js")
  });

  // Categories list
  createPage({
    path: "/categories",
    component: path.resolve("./src/templates/categories-list-template.js")
  });

  // Auth template
  createPage({
    path: "/auth",
    component: path.resolve("./src/templates/auth-template.js")
  });

  // Posts and pages from markdown
  const result = await graphql(`
    {
      allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }) {
        edges {
          node {
            id
            frontmatter {
              template
              activity
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  const { edges } = result.data.allMarkdownRemark;

  const postEdges = edges.filter(
    edge => edge.node.frontmatter.template === "post"
  );

  const strava = await getStrava(stravaConfig);

  const activitiesPromise = await postEdges.map(async edge => {
    const data = await getData(strava, edge.node.frontmatter.activity);
    return {
      data,
      id: edge.node.id
    };
  });

  const activities = await Promise.all(activitiesPromise);

  console.log(activities);

  _.each(edges, edge => {
    if (_.get(edge, "node.frontmatter.template") === "page") {
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve("./src/templates/page-template.js"),
        context: { slug: edge.node.fields.slug }
      });
    } else if (_.get(edge, "node.frontmatter.template") === "post") {
      const activity = activities.find(
        activity => activity.id === edge.node.id
      );

      createPage({
        path: edge.node.fields.slug,
        component: path.resolve("./src/templates/post-template.js"),
        context: { slug: edge.node.fields.slug, activityData: activity.data }
      });
    }
  });

  // Feeds
  await createTagsPages(graphql, actions);
  await createCategoriesPages(graphql, actions);
  await createPostsPages(graphql, actions);
};

module.exports = createPages;
