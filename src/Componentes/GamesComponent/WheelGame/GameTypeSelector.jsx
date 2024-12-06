import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GameTypeSelector() {
  const [selected, setSelected] = useState("Manual");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameType = urlParams.get("gameType");
    if (gameType) {
      setSelected(gameType);
    }
  }, []);

  const handleClick = (type) => {
    setSelected(type);

    const url = new URL(window.location);
    url.searchParams.set("gameType", type);
    window.history.pushState({}, "", url);
  };

  return (
    <div>
      <div className="w-full flex space-x-2 bg-gray-800 rounded-full px-2 py-3">
        <Link
          to={{
            pathname: "/home",
            search: `?game=wheel&gameType=Manual`,
          }}
          className={`relative w-1/2 px-6 py-2 text-center rounded-full overflow-hidden font-medium transition-all ${
            selected === "Manual"
              ? "bg-blue-500 text-gray-100"
              : "bg-gray-300 text-gray-900"
          }`}
        >
          <span
            className={`absolute rounded-lg inset-0 z-[-1] bg-blue-500 transition-all duration-300 ease-in-out 
            ${
              selected === "Manual"
                ? "transform scale-x-100"
                : "transform scale-x-0"
            } origin-right`}
          />
          Manual
        </Link>

        <Link
          to={{
            pathname: "/home",
            search: `?game=wheel&gameType=Auto`,
          }}
          className={`relative w-1/2 px-6 py-2 text-center rounded-full overflow-hidden font-medium transition-all ${
            selected === "Auto"
              ? "bg-blue-500 text-gray-100"
              : "bg-gray-300 text-gray-900"
          }`}
        >
          <span
            className={`absolute rounded-lg inset-0 z-[-1] bg-blue-500 transition-all duration-300 ease-in-out 
            ${
              selected === "Auto"
                ? "transform scale-x-100"
                : "transform scale-x-0"
            } origin-left`}
          />
          Auto
        </Link>
      </div>
    </div>
  );
}
