import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{"Dark E-Commerce " + title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "",
  description: "We sell stuff Yo",
  keywords: "buy stuff, buy games, comemrce",
};

export default Meta;
