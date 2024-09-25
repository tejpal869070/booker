import React, { useEffect, useState } from "react";
import { ColorGameAllResult } from "../../Controllers/User/GamesController";
import swal from "sweetalert";

export default function ColorGameHistory({ gameType, refreshHistory }) {
  const [gameHistory, setGameHistory] = useState([]);
  const getGameHistory = async (gameType) => {
    try {
      const response = await ColorGameAllResult(gameType);
      if (response.status) {
        setGameHistory(response.data);
      } else {
        window.location.reload();
      }
    } catch (error) {
      swal({
        title: "Error!",
        text: "Something Went Wrong",
        icon: "error",
        buttons: {
          confirm: "OK",
        },
        dangerMode: true,
      }).then((willRedirect) => {
        if (willRedirect) {
          window.location.reload();
        }
      });
    }
  };

  useEffect(() => {
    getGameHistory(gameType);
  }, [gameType,refreshHistory]);

  return (
    <div>
      <div className="relative overflow-x-auto  z-0">
        <p className="font-semibold dark:text-gray-200">Game Recoard : </p>
        <div className="flex flex-wrap gap-4 mt-4">
          {gameHistory &&
            gameHistory.map((item, index) => (
              <div className="relative flex justify-center w-16 h-16">
                <div
                  className="w-10 h-10 relative  text-white rounded-full flex items-center justify-center font-semibold text-lg"
                  style={{ backgroundColor: item.color_code }}
                >
                  <p className="z-[999]">{item.number}</p>
                </div>
                {item.number === "5" || item.number === "0" ? (
                  <div className="absolute w-5 h-10 rounded-r-full right-3  bg-[#5e1287]"></div>
                ) : (
                  ""
                )}
                <div className="absolute font-medium bottom-1 bg-gray-400 rounded-lg px-3 ">
                  {item.period.slice(-4)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
