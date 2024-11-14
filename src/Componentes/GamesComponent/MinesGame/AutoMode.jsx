import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { mines } from "../../../assets/Data/GamesData";

export default function AutoMode() {
  const [totalBombs, setTotalBombs] = useState(1);
  const [amount, setAmount] = useState(100);
  const [totlaBalance, setTotalBalance] = useState(1000);
  const [userSelectedIndex, setUserSelectedIndex] = useState([]);
  const [isAutoBetStart, setAutoBetStart] = useState(false);
  const [totalBets, setTotalBets] = useState(2);
  const [stopLoss, setStopLoss] = useState();
  const [stopProfit, setStopProfit] = useState();

  const handleCardClick = (item) => {
    setUserSelectedIndex((prev) => {
      const newIndex = prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id];

      return newIndex;
    });
  };

  const handleAutoStart = () => {
    setAutoBetStart(true);
  };

  useEffect(() => {
    const element = document.getElementById("boxBoard");
    if (element) {
      ReactDOM.createRoot(element).render(
        <div>
          <div class=" grid  grid-cols-5 gap-2 px-4 py-3  ">
            {mines.map((item, index) => (
              <button
                disabled={isAutoBetStart}
                onClick={() => handleCardClick(item)}
                className={`w-full h-16 flex justify-center items-center shadow-lg lg:h-28  rounded-xl ${
                  userSelectedIndex.includes(item.id)
                    ? "bg-indigo-500 border-indigo-800 border-4"
                    : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>
        </div>
      );
    }
  }, [userSelectedIndex, isAutoBetStart]);
  return (
    <div>
      <div>
        <div className="flex justify-between dark:text-gray-200">
          <p className="lg:text-sm font-medium">Bet Amount</p>
          <p>₹{totlaBalance}</p>
        </div>
        <input
          className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
          placeholder="Enter Amount "
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <p className="lg:text-sm text-gray-200 font-medium mt-1">
          Number Of Bets
        </p>
        <input
          className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
          placeholder="Enter Bets Number "
          value={totalBets}
          onChange={(e) => setTotalBets(e.target.value)}
        />
        <p className="mt-3 lg:mt-2 lg:text-sm dark:text-gray-200 font-medium">
          Bombs
        </p>
        <div className="flex justify-between  ">
          <div className="flex w-1/2 ">
            <button
              disabled={totalBombs === 1}
              onClick={() => setTotalBombs(totalBombs - 1)}
              className="rounded-l py-1 w-[25%] bg-gray-800 text-gray-200 text-center px-2 cursor-pointer"
            >
              -
            </button>
            <div className="py-1 w-[50%] bg-gray-200 text-gray-800 px-4 text-center">
              {totalBombs}
            </div>
            <button
              disabled={totalBombs === 24}
              onClick={() => setTotalBombs(totalBombs + 1)}
              className="rounded-r py-1 w-[25%] bg-gray-800 text-gray-200 text-center px-2 cursor-pointer"
            >
              +
            </button>
          </div>
          <p className="font-medium dark:text-gray-200">
            Profit{" "}
            <span className="ml-2 font-semibold text-xl text-green-300">
              x{(totalBombs * 1.5).toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={() => handleAutoStart()}
          disabled={userSelectedIndex.length === 0}
          className={`w-full rounded font-semibold text-lg text-white py-2 mt-3 ${
            userSelectedIndex.length > 0 ? "bg-green-400" : "bg-gray-400"
          }`}
        >
          Start Auto Bet
        </button>
      </div>
    </div>
  );
}
