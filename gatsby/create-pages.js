"use strict";

const path = require("path");
const _ = require("lodash");
const createCategoriesPages = require("./pagination/create-categories-pages.js");
const createTagsPages = require("./pagination/create-tags-pages.js");
const createPostsPages = require("./pagination/create-posts-pages.js");
const getStrava = require("../src/utils/getStrava");

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

  const postEdges = edges;
  // .map(
  //   edge => edge.node.frontmatter.template === "post"
  // );

  const activitiesPromise = await postEdges.map(async edge => {
    // console.log(edge.node);
    const data = await getStrava(edge.node.frontmatter.activity);
    return {
      data,
      id: edge.node.id
    };
    // activities.push({
    //   slug: edge.node.fields.slug,
    //   activityNum: edge.node.frontmatter.act
    // });
  });

  const activities = await Promise.all(activitiesPromise);

  // const activityData = await getStrava(123422);
  console.log(activities);
  // console.log(activityData);

  _.each(edges, edge => {
    if (_.get(edge, "node.frontmatter.template") === "page") {
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve("./src/templates/page-template.js"),
        context: { slug: edge.node.fields.slug }
      });
    } else if (_.get(edge, "node.frontmatter.template") === "post") {
      const aData = activities.find(activity => activity.id === edge.node.id);
      // console.log(aData.data);
      // ocactivityData = 1423;

      createPage({
        path: edge.node.fields.slug,
        component: path.resolve("./src/templates/post-template.js"),
        context: { slug: edge.node.fields.slug, activityData: aData.data }
      });
    }
  });

  // Feeds
  await createTagsPages(graphql, actions);
  await createCategoriesPages(graphql, actions);
  await createPostsPages(graphql, actions);
};

module.exports = createPages;
