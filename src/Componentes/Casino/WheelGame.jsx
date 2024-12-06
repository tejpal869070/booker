import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import ManualMode from "../GamesComponent/WheelGame/ManualMode";
import AutoMode from "../GamesComponent/WheelGame/AutoMode";

const WheelGame = () => {
  const [selected, setSelected] = useState("Manual");

  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const gameType = queryParams.get("gameType");

    if (gameType) { 
      setSelected(gameType)
    }
  }, [location.search]);

  return (
    <div className="min-h-screen ">
       {selected === "Auto" ? <AutoMode/> : <ManualMode/> }
    </div>
  );
};

export default WheelGame;
