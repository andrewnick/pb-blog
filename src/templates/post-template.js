// @flow strict
import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Post from "../components/Post";
import { useSiteMetadata } from "../hooks";
import type { MarkdownRemark, ActivityData } from "../types";

type Props = {
  data: {
    markdownRemark: MarkdownRemark
  },
  pageContext: {
    activityData: ActivityData
  }
};

const PostTemplate = ({ data, pageContext }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();
  const { frontmatter } = data.markdownRemark;
  const {
    title: postTitle,
    description: postDescription,
    socialImage
  } = frontmatter;
  const { activityData } = pageContext;
  const metaDescription =
    postDescription !== null ? postDescription : siteSubtitle;

  console.log(data);

  return (
    <Layout
      title={`${postTitle} - ${siteTitle}`}
      description={metaDescription}
      socialImage={socialImage}
    >
      <Post post={data.markdownRemark} activityData={activityData} />
    </Layout>
  );
};

export const query = graphql`
  query PostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
        tagSlugs
      }
      frontmatter {
        date
        description
        activity
        zoom
        tags
        title
        socialImage
      }
    }
  }
`;

export default PostTemplate;
