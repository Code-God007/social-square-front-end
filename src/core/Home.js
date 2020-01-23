import React from "react";
import Posts from "../post/Posts";

export default function Home() {
  return (
    <>
      <div className="jumbotron">
        <h2 style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}>
          Social Square
        </h2>
        <h4 className="display-4">Welcome To Social Square</h4>
        <p className="lead ml-2">Connect to the World Now</p>
      </div>
      <div className="container">
        <Posts />
      </div>
    </>
  );
}
