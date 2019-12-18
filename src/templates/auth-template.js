// @flow strict
import React from "react";
import Layout from "../components/Layout";
import Page from "../components/Page";
import Auth from "../components/Auth";
import { useSiteMetadata } from "../hooks";

const AuthTemplate = () => {
  const { title, subtitle } = useSiteMetadata();

  return (
    <Layout title={`Categories - ${title}`} description={subtitle}>
      <Page title="Auth">
        <Auth />
      </Page>
    </Layout>
  );
};

export default AuthTemplate;
