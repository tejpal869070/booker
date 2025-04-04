import React from "react";
import { useState } from "react";
import { SiHeadspace } from "react-icons/si";
import { TbSquareRotatedFilled } from "react-icons/tb";
import headsImage from "../../assets/photos/heads.png";
import tailsImage from "../../assets/photos/tails.png";
import GameHistory from "../GamesComponent/Limbo/GameHistory";

export default function CoinFlip() {
  const [refreshHistory, setRefreshHistory] = useState(false);

  const [flipResult, setFlipResult] = useState(null);
  const [flipping, setFlipping] = useState(false);

  const flipCoin = () => {
    setFlipping(true);
    setTimeout(() => {
      const result = Math.random() < 0.5 ? "heads" : "tails";
      setFlipResult(result);
      setFlipping(false);
    }, 1000); // Simulate a 1 second flip delay
  };

  return (
    <div className="min-h-screen ">
      {/* {isFlashPopup && <FlashPopup handleClose={handleClose} />} */}
      <div className="flex flex-wrap-reverse m-auto  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <div className="w-[100%]  lg:w-[30%]  p-6 h-screen/2 bg-[#213743]">
          <div>
            <div className="flex justify-between dark:text-gray-200">
              <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                Bet Amount
              </p>
              <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                $2
              </p>
            </div>
            <div className="flex relative items-center">
              <input
                className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                placeholder="Enter Amount "
                // value={amount}
                // onChange={(e) => setAmount(e.target.value)}
              />
              <div className="absolute right-0.5 ">
                <button
                  //   onClick={() => {
                  //     if (amount > 1) {
                  //       setAmount((pre) => pre / 2);
                  //     } else {
                  //       setAmount(1);
                  //     }
                  //   }}
                  className="px-1.5  py-1.5 bg-gray-500 text-gray-200   text-sm  font-medium"
                >
                  1/2
                </button>
                <button
                  //   onClick={() => doubleTheAmount()}
                  className="px-1.5  py-1.5 bg-gray-500 text-gray-200 border-l-2 text-sm cursor-pointer font-medium border-gray-200"
                >
                  2x
                </button>
              </div>
            </div>
            <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
              Bombs
            </p>
            <div className="flex  mt-1 ">
              <div className="flex  w-full justify-between">
                <button className="rounded-l flex items-center gap-2 justify-center text-sm py-2 w-[48%] bg-gray-800 text-gray-200 text-center px-2 cursor-pointer">
                  Heads <SiHeadspace size={16} color="#ffa200" />
                </button>

                <button className="rounded-r flex items-center gap-2 justify-center text-sm py-2 w-[48%] bg-gray-800 text-gray-200 text-center px-2 cursor-pointer">
                  Tails <TbSquareRotatedFilled size={16} color="#4d6fff" />
                </button>
              </div>
            </div>
            <button className="w-full rounded bg-[#20e701] font-semibold py-2 text-sm mt-3">
              Place Bet
            </button>
          </div>
        </div>
        <div className=" relative w-[100%]  lg:w-[70%]  p-6 min-h-[50vh]  bg-[#0f212e]">
          <div className="flex flex-col items-center justify-center  ">
            <div className="mb-6 absolute flex items-center justify-center top-0 w-full h-full">
              <div className="coin relative w-32 h-32">
                <img
                  alt="coin heads"
                  src={headsImage}
                  className="side heads absolute w-full h-full"
                />
                <img
                  alt="coin tails"
                  src={tailsImage}
                  className="side tails absolute w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="m-auto mt-6  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <GameHistory type={"mines"} refreshHistory={refreshHistory} />
      </div>
    </div>
  );
}
