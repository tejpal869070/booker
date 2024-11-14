import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ColorGame from "../Componentes/Casino/ColorGame";
import Card2020 from "../Componentes/Casino/Aviator";
import Aviator from "../Componentes/Casino/Aviator";
import MinesGame from "../Componentes/Casino/MinesGame";
import Plinko from "../Componentes/Casino/Plinko";

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

  // useEffect(() => {
  //   console.log(paramsData);
  // }, [paramsData]);

  if (paramsData && paramsData.game === "color-game") {
    return <div>{<ColorGame />}</div>;
  } else if (paramsData && paramsData.game === "mines") {
    return <div>{<MinesGame />}</div>;
  } else if (paramsData && paramsData.game === "aviator") {
    return <div>{<Aviator />}</div>;
  } else if (paramsData && paramsData.game === "plinko") {
    return <div>{<Plinko />}</div>;
  } else {
    return <div>no game selected</div>;
  }
}
