import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { mines } from "../../../assets/Data/GamesData";

export default function ManualMode({ isBetPlacedFunction }) {
  const [amount, setAmount] = useState(100);
  const [totalBombs, setTotalBombs] = useState(1);
  const [totlaBalance, setTotalBalance] = useState(1000);
  const [bombIndex, setBombIndex] = useState([]);
  const [diamndIndex, setDiamondIndex] = useState([]);
  const [openedMines, setOpenedMines] = useState([]);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const [bombFound, setBombFound] = useState(false);

  const resetGame = () => {
    setOpenedMines([]);
    setBombFound(false);
    generateRandom();
  };

  const handleBetPlace = () => {
    setIsBetPlaced(true);
    setTotalBalance(totlaBalance - amount);
  };

  const handleCashOut = () => {
    setBombFound(true);
    const audio = new Audio(require("../../../assets/audio/successSound.mp3")); // or use a URL
    audio.play();
    setIsBetPlaced(false);
    setTotalBalance(
      totlaBalance + amount * (totalBombs * 1.5) * openedMines.length
    );
    setTimeout(() => {
      resetGame();
    }, 2000);
  };

  const handleCardClick = (item) => {
    setOpenedMines((pre) => [...pre, item.id]);
    if (bombIndex.includes(item.id)) {
      setBombFound(true);
      setIsBetPlaced(false);
      const audio = new Audio(require("../../../assets/audio/blast1.mp3")); // or use a URL
      audio.play();
      setTimeout(() => {
        resetGame();
      }, 2000);
    } else {
      const audio = new Audio(require("../../../assets/audio/success1.mp3")); // or use a URL
      audio.play();
    }
  };

  const generateRandom = () => {
    const allRandomNumbers = new Set();
    while (allRandomNumbers.size < totalBombs) {
      const randomNumber = Math.floor(Math.random() * 25) + 1; // assuming numbers between 1 and 25
      allRandomNumbers.add(randomNumber);
    }
    // Generate diamond indices
    const bombIndexes = Array.from(allRandomNumbers);
    const allIndexes = new Set(Array.from({ length: 25 }, (_, i) => i + 1)); // All numbers from 1 to 25
    const diamondIndexes = Array.from(
      new Set([...allIndexes].filter((num) => !allRandomNumbers.has(num)))
    );

    // Set the bomb and diamond indices
    setBombIndex(bombIndexes);
    setDiamondIndex(diamondIndexes);
  };

  useEffect(() => {
    generateRandom();
  }, [totalBombs]);

  useEffect(() => {
    isBetPlacedFunction(isBetPlaced);
  }, [isBetPlaced]);

  useEffect(() => {
    const element = document.getElementById("boxBoard");
    if (element) {
      ReactDOM.createRoot(element).render(
        <div>
          <div class=" grid  grid-cols-5 gap-2 px-4 py-3  ">
            {mines.map((item, index) => (
              <button
                onClick={() => handleCardClick(item)}
                disabled={!isBetPlaced}
                className={`w-full h-16 flex justify-center items-center shadow-lg lg:h-28 bg-gray-300 rounded-xl `}
              >
                {bombFound ? (
                  diamndIndex.includes(item.id) ? (
                    <img
                      className="m-auto w-12 animate-rotate-y animate-once animate-duration-[3000ms]"
                      src={require("../../../assets/photos/diamond.png")}
                    />
                  ) : (
                    <img
                      className="m-auto w-16 animate-wiggle animate-infinite"
                      src={require("../../../assets/photos/time-bomb.png")}
                    />
                  )
                ) : openedMines.includes(item.id) &&
                  diamndIndex.includes(item.id) ? (
                  <img
                    className="m-auto w-12 "
                    src={require("../../../assets/photos/diamond.png")}
                  />
                ) : openedMines.includes(item.id) &&
                  bombIndex.includes(item.id) ? (
                  <img
                    className="m-auto w-12"
                    src={require("../../../assets/photos/time-bomb.png")}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      );
    }
  }, [openedMines, isBetPlaced]);

  return (
    <div>
      <div>
        {isBetPlaced ? (
          <div className="mt-4">
            <div className="flex justify-between">
              <p className="font-medium">
                Bombs: <span className="text-lg lg:text-md text-red-400">{totalBombs}</span>
              </p>{" "}
              <p className="font-medium">
                Balance:{" "}
                <span className="text-lg lg:text-md text-green-400">₹{totlaBalance}</span>
              </p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">
                Bet Amt.: <span className="text-lg lg:text-md">₹{amount}</span>
              </p>{" "}
              <p className="font-medium">
                Profit:{" "}
                <span className="text-lg lg:text-md text-green-400">
                  x{openedMines.length * (totalBombs * 1.5).toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        ) : (
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
          </div>
        )}

        {isBetPlaced ? (
          <button
            onClick={() => handleCashOut()}
            disabled={openedMines.length === 0}
            className="w-full rounded bg-green-400 font-semibold text-lg text-white py-2 mt-3"
          >
            <div>
              <p>CASHOUT</p>
              <p className="px-6 py-0.5  rounded-lg bg-gray-800 text-center inline">
                ₹{amount * (totalBombs * 1.5) * openedMines.length}
              </p>
            </div>
          </button>
        ) : (
          <button
            disabled={isBetPlaced || openedMines.length > 0} // it is already disabled id isBetPlaced is true
            onClick={() => handleBetPlace()}
            className="w-full rounded bg-green-400 font-semibold text-lg text-white py-2 mt-3"
          >
            Place Bet
          </button>
        )}
      </div>
    </div>
  );
}
