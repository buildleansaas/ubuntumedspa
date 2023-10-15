import React from "react";

import CtaFooter from "components/cta-footer";
import Jumbotron from "views/jumbotron";
import Procedures from "views/procedures";
import LatestPosts from "views/latest-posts";
import Products from "views/products";

export default async function Page() {
  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 z-10">
      <Jumbotron />
      <Procedures />
      <Products />
      <LatestPosts />
      <CtaFooter />
    </div>
  );
}
