// @flow strict
import React from "react";
import { withPrefix, Link } from "gatsby";
import { getContactHref } from "../../../utils";
import styles from "./Author.module.scss";
import { useSiteMetadata } from "../../../hooks";

const Author = () => {
  const { author } = useSiteMetadata();

  return (
    <div className={styles["author"]}>
      <div className={styles["author__image"]}>
        <Link to="/">
          <img
            src={withPrefix(author.photo)}
            className={styles["author__photo"]}
            width="75"
            height="75"
            alt={author.name}
          />
        </Link>
      </div>
      <p className={styles["author__bio"]}>
        <div>
          <strong>{author.name}</strong>
        </div>
        <p className={styles["author__subtitle"]}>{author.bio}</p>
        {/* <a
          className={styles['author__bio-twitter']}
          href={getContactHref('twitter', author.contacts.twitter)}
          rel="noopener noreferrer"
          target="_blank"
        >
           on Twitter
        </a> */}
      </p>
    </div>
  );
};

export default Author;
