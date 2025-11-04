"use client";

import React from "react";
import Search from "./Search";
import FamousTourist from "./FamousTourist.jsx";
import TralveFeatured from "./TralveFeatured";
import Banner from "./Banner";
import ConfidentTralvel from "./ConfidentTralvel";
import News from "./News";
const Body = () => {
  return (
    <>
      <Banner />
      <Search />
      <News />
      <FamousTourist />
      <TralveFeatured />
      <ConfidentTralvel />
    </>
  );
};

export default Body;
