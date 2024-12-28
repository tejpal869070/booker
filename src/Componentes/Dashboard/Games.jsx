import React from "react";
import { Link } from "react-router-dom";

export default function Games() {
  return (
    <div>
      <div class="flex flex-wrap     py-3 gap-[1.3%]  ">
        {gameData.map((item, index) => (
          <Link
            to={item.to}
            class="w-[32%] md:w-[19%] lg:w-[15%] mb-4   bg-gray-300 rounded-xl"
          >
            <img alt="poster" src={item.image} className="rounded-xl"/>
          </Link>
        ))}
      </div>

      <Link className="cursor-pointer" to={{ pathname: "/home", search: `?game=casino` }}>
        <img
          alt="casino poater"
          src={require("../../assets/photos/casino-1.jpg")}
          className="w-full mb-4"
        />
      </Link>
    </div>
  );
}

const gameData = [
  {
    id: 1,
    image: require("../../assets/photos/colorgame1.png"),
    to: { pathname: "/home", search: "?game=color-game" },
  },
  {
    id: 2,
    image: require("../../assets/photos/minesgme.png"),
    to: { pathname: "/home", search: "?game=mines" },
  },
  {
    id: 3,
    image: require("../../assets/photos/wheel.png"),
    to: { pathname: "/home", search: "?game=wheel" },
  },
  {
    id: 4,
    image: require("../../assets/photos/aviator.png"),
    to: { pathname: "/home", search: "?game=casino-lobby&data=eyJwcm92aWRlckNvZGUiOiJQRyIsImdhbWVDb2RlIjoiQVRSIn0%3D" },
  },
  {
    id: 4,
    image: require("../../assets/photos/dragon.png"),
    to: { pathname: "/home", search: "?game=casino-lobby&data=eyJwcm92aWRlckNvZGUiOiJTTiIsImdhbWVDb2RlIjoiRFQ3TSJ9" },
  },
  {
    id: 4,
    image: require("../../assets/photos/ander.png"),
    to: { pathname: "/home", search: "?game=casino-lobby&data=eyJwcm92aWRlckNvZGUiOiJTTiIsImdhbWVDb2RlIjoiQUJDIn0%3D" },
  },
  {
    id: 4,
    image: require("../../assets/photos/LUCKY.png"),
    to: { pathname: "/home", search: "?game=casino-lobby&data=eyJwcm92aWRlckNvZGUiOiJTTiIsImdhbWVDb2RlIjoiVUQ3In0%3D" },
  },
  {
    id: 4,
    image: require("../../assets/photos/3PATTI.png"),
    to: { pathname: "/home", search: "?game=casino-lobby&data=eyJwcm92aWRlckNvZGUiOiJTTiIsImdhbWVDb2RlIjoiVFAyMCJ9" },
  },
  {
    id: 4,
    image: require("../../assets/photos/VIEWALL.png"),
    to: { pathname: "/home", search: "?game=casino" },
  },
];
