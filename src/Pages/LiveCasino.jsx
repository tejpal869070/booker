import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ColorGame from "../Componentes/Casino/ColorGame";
import Aviator from "../Componentes/Casino/Aviator";
import MinesGame from "../Componentes/Casino/MinesGame";
import Plinko from "../Componentes/Casino/Plinko";
import WheelGame from "../Componentes/Casino/WheelGame";
import LiveCasinoDashboard from "../Componentes/Casino/LiveCasinoDashboard";
import CasinoLobby from "../Componentes/Casino/CasinoLobby";

export default function LiveCasino() {
  const location = useLocation();

  // get path and query to display content in inner section
  const paramsData = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    const data = {};
    for (const [key, value] of queryParams.entries()) {
      data[key] = value;
    }
    return data;
  }, [location.search]);

  if (paramsData && paramsData.game === "color-game") {
    return <div>{<ColorGame />}</div>;
  } else if (paramsData && paramsData.game === "mines") {
    return <div>{<MinesGame />}</div>;
  } else if (paramsData && paramsData.game === "aviator") {
    return <div>{<Aviator />}</div>;
  } else if (paramsData && paramsData.game === "plinko") {
    return <div>{<Plinko />}</div>;
  } else if (paramsData && paramsData.game === "wheel") {
    return <div>{<WheelGame />}</div>;
  } else if (paramsData && paramsData.game === "casino") {
    return <div>{<LiveCasinoDashboard />}</div>;
  } else if (paramsData && paramsData.game === "casino-lobby") {
    return <div>{<CasinoLobby />}</div>;
  } else {
    return (
      <div>
        <iframe
          src="https://www.crazygames.com/embed/ragdoll-archers"
          style={{ width: "80vw", height: "90vh" }}
          frameborder="0"
          allow="gamepad *;"
        ></iframe>
      </div>
    );
  }
}
