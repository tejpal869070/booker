import React, { useEffect } from "react";
import { useState } from "react";
import ManualMode from "../GamesComponent/MinesGame/ManualMode";
import AutoMode from "../GamesComponent/MinesGame/AutoMode";
import { FlashPopup } from "../GamesComponent/RechargePopup";

export default function MinesGame() {
  const [selected, setSelected] = useState("Manual");
  const [isBetPlaced, setIsBetPlaced] = useState();
  const [isFlashPopup, setFlashPopup] = useState(true);
  const [isRecharged, setRecharged] = useState(false);

  const handleClick = (type) => {
    setSelected(type);
  };

  const isBetPlacedFunction = (betPlaced) => {
    if (betPlaced) {
      setIsBetPlaced(true);
    } else { 
      setIsBetPlaced(false);
    }
  };

  const handleClose = () => {
    setFlashPopup(false);
    setRecharged((pre) => !pre);
  };

  return (
    <div className="min-h-screen ">
      {isFlashPopup && <FlashPopup handleClose={handleClose} />}
      <div className="flex flex-wrap-reverse">
        <div className="w-[100%] md:w-[35%] lg:w-[25%] p-6 h-screen/2 bg-gray-500">
          <div className="w-full flex space-x-2 bg-gray-800 rounded-full px-2 py-3">
            <button
              onClick={() => handleClick("Manual")}
              disabled={isBetPlaced}
              className={`relative w-1/2 px-6 py-2 rounded-full overflow-hidden  font-medium   transition-all  ${
                selected === "Manual"
                  ? "bg-blue-500 text-gray-100"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              <span
                className={`absolute rounded-lg inset-0 z-[-1] bg-blue-500 transition-all duration-300 ease-in-out 
            ${
              selected === 1 ? "transform scale-x-100" : "transform  scale-x-0"
            } origin-right`}
              />
              Manual
            </button>

            <button
              onClick={() => handleClick("Auto")}
              disabled={isBetPlaced}
              className={`relative w-1/2 px-6 py-2 rounded-full overflow-hidden  font-medium transition-all  ${
                selected === "Auto"
                  ? "bg-blue-500 text-gray-100"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              <span
                className={`absolute rounded-lg inset-0 z-[-1] bg-blue-500 transition-all duration-300 ease-in-out 
            ${
              selected === 2 ? "transform scale-x-100" : "transform scale-x-0"
            } origin-left`}
              />
              Auto
            </button>
          </div>

          {selected === "Manual" ? (
            <ManualMode
              isBetPlacedFunction={(isBetPlaced) =>
                isBetPlacedFunction(isBetPlaced)
              }
              isRecharged={isRecharged}
            />
          ) : (
            <AutoMode
              isBetPlacedFunction={(isBetPlaced) =>
                isBetPlacedFunction(isBetPlaced)
              }
            />
          )}
        </div>
        <div
          id="boxBoard"
          className=" relative w-[100%] md:w-[65%] lg:w-[75%] p-6 h-screen/2 bg-[#0F212E]"
        ></div>
      </div>
    </div>
  );
}
