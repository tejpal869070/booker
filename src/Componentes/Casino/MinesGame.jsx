import React, { useEffect, useState } from "react";

export default function MinesGame() {
  const [selected, setSelected] = useState(1);

  const [foundBomb, setFoundBomb] = useState(false);
  const [foundDiamond, setFoundDiamond] = useState(false);
  const [bombIndex, setBombIndex] = useState([]);
  console.log(bombIndex);
  const [diamondIndex, setDiamondIndex] = useState(null);
  const [openedMines, setOpenedMines] = useState([]);
  const [amount, setAmount] = useState(100);

  const [totalBombs, setTotalBombs] = useState(1);

  const handleClick = (button) => {
    setSelected(button);
  };

  // card click function
  const handleCardClick = (item) => {
    if (bombIndex.includes(item.id)) {
      setFoundBomb(true);
      setBombIndex((pre) => [...pre, item.id]);
      setTimeout(() => {
        resetGame();
      }, 2000);
    } else {
      setFoundDiamond(true);
      setDiamondIndex(item.id);
      setOpenedMines((prevMines) => [...prevMines, item]);
    }
  };

  const resetGame = () => {
    setFoundBomb(false);
    setBombIndex([]);
    setDiamondIndex(null);
    setFoundDiamond(false);
    setOpenedMines([]);
    setTotalBombs(1);
    generateRandom();
  };

  const generateRandom = () => {
    const allRandomNumbers = new Set();
    while (allRandomNumbers.size < totalBombs) {
      const randomNumber = Math.floor(Math.random() * 25) + 1; // assuming numbers between 1 and 25
      allRandomNumbers.add(randomNumber);
    }
    setBombIndex(Array.from(allRandomNumbers));
  };

  useEffect(() => {
    generateRandom();
  }, [totalBombs]);

  return (
    <div className=" ">
      <div className="flex flex-wrap-reverse">
        <div className="w-[100%] md:w-[35%] lg:w-[25%] p-6 h-screen/2 bg-gray-500">
          {/* Manual Auto Button */}
          <div className="w-full flex space-x-2 bg-gray-800 rounded-full px-2 py-3">
            <button
              onClick={() => handleClick(1)}
              className={`relative w-1/2 px-6 py-2 rounded-full overflow-hidden  font-medium z-[99] transition-all  ${
                selected === 1
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
              onClick={() => handleClick(2)}
              className={`relative w-1/2 px-6 py-2 rounded-full overflow-hidden  font-medium transition-all  ${
                selected === 2
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
          {/* Bet Amount */}
          <div className="mt-1 px-1 w-full">
            <div className="flex justify-between dark:text-gray-200">
              <p className="lg:text-sm font-medium">Bet Amount</p>
              <p>₹5000</p>
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
                  x{(totalBombs * 1.5).toFixed(0)}
                </span>
              </p>
            </div>

            {/* place bet button */}
            <button className="w-full rounded bg-green-400 font-semibold text-lg text-white py-2 mt-3">
              Place Bet
            </button>
          </div>
        </div>
        {/* mines */}
        <div className="relative w-[100%] md:w-[65%] lg:w-[75%] p-6 h-screen/2 bg-gray-600">
          <div class=" grid  grid-cols-5 gap-2 px-4 py-3  ">
            {mines.map((item, index) => (
              <div
                onClick={() => handleCardClick(item)}
                class="w-full h-16 flex justify-center items-center shadow-lg lg:h-28 bg-gray-300 rounded-xl"
              >
                {foundBomb && (item.id === bombIndex.includes(item.id)) ? (
                  <img
                    className="m-auto w-12"
                    src={require("../../assets/photos/time-bomb.png")}
                  />
                ) : foundDiamond && item.id === diamondIndex ? (
                  <img
                    className="m-auto w-12"
                    src={require("../../assets/photos/diamond.png")}
                  />
                ) : openedMines.some((mine) => mine.id === item.id) ? (
                  <img
                    className="m-auto w-12"
                    src={require("../../assets/photos/diamond.png")}
                  />
                ) : null}
              </div>
            ))}
          </div>
          {foundBomb && (
            <div className="absolute inset-0 flex items-center justify-center w-full h-full">
              <img
                alt="explosion"
                className="w-40 animate-zoom-in hover:scale-[200%]"
                src={require("../../assets/photos/explosion.png")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const mines = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 },
  { id: 21 },
  { id: 22 },
  { id: 23 },
  { id: 24 },
  { id: 25 },
];
