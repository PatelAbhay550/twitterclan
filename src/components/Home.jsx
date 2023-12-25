import React from "react";
import { Link } from "react-router-dom";
import Timeline from "./Timeline";

const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <Timeline />
      <Link to="/profile">Go to Profile</Link>
    </div>
  );
};

export default Home;
