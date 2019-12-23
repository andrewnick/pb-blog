// @flow strict
import React from "react";
import { Link } from "gatsby";
import Author from "./Author";
import Comments from "./Comments";
import Content from "./Content";
import Meta from "./Meta";
import Tags from "./Tags";
import Header from "../Header";
import Map from "../Map";
import ElevationMap from "../ElevationMap";
import HexagonMap from "../Map/HexagonMap";
import ColumnMap from "../ColumnMap";
import styles from "./Post.module.scss";
import type { Node, ActivityData } from "../../types";

type Props = {
  post: Node,
  activityData: ActivityData
};

const Post = ({ post, activityData }: Props) => {
  const { html } = post;
  const { tagSlugs, slug } = post.fields;
  const { tags, title, date, zoom, description } = post.frontmatter;
  // console.log(activityData);

  const intro = `<p>${description}</p>`;

  return (
    <div className={styles["post"]}>
      <Link className={styles["post__home-button"]} to="/">
        All Articles
      </Link>
      <Header title={title} activityData={activityData} zoom={zoom} />
      {/* <HexagonMap /> */}
      {/* <ColumnMap activityData={activityData} /> */}
      {/* <ElevationMap activityData={activityData} /> */}
      <div className={styles["post__content"]}>
        {description && <Content body={intro} />}

        <Map activityData={activityData} zoom={zoom} />
        <ElevationMap activityData={activityData} zoom={zoom} />

        <Content body={html} />
      </div>
      <div className={styles["post__footer"]}>
        <Meta date={date} />
        {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
        <Author />
      </div>
      <div className={styles["post__comments"]}>
        <Comments postSlug={slug} postTitle={post.frontmatter.title} />
      </div>
    </div>
  );
};

export default Post;
