import React from "react";
import loading1img from "../assets/photos/loadinggif.gif";

export function Loading1({ width }) {
  return (
    <div className="flex justify-center items-center ">
      <img alt="loading" src={loading1img} width={width} height={width} />
    </div>
  );
} 

export function Loading2() {
  return (
    <div className="flex justify-center items-center">
      <p>Loading...</p>
    </div>
  );
}
