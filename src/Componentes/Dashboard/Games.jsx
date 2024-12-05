import React from "react";
import { Link } from "react-router-dom";

export default function Games() {
  return (
    <div>
      <div class="flex flex-wrap     py-3 gap-[1.3%]  ">
        {gameData.map((item, index) => (
          <Link
            to={item.to}
            class="w-[32%] md:w-[19%] lg:w-[15%] mb-2   bg-gray-300 rounded-xl"
          >
            <img alt="poster" src={item.image} />
          </Link>
        ))}
      </div>
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
    id: 2,
    image: require("../../assets/photos/wheel.png"),
    to: { pathname: "/home", search: "?game=wheel" },
  },
];
