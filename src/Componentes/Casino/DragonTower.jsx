import React, { useEffect, useRef, useState } from "react";
import bg1 from "../../assets/photos/dragon-bg-3.jpg";
import bg2 from "../../assets/photos/dragon-bg2.jpg";

import { IoReloadCircle } from "react-icons/io5";

export default function DragonTower() {
  const [selected, setSelected] = useState("Manual");
  const [amount, setAmount] = useState(100);
  const [totlaBalance, setTotalBalance] = useState();
  const [cols, setCols] = useState(4);
  const [level, setLevel] = useState("easy");
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [rows, setRows] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const handleClick = (type) => {
    setSelected(type);
  };
  const amountRef = useRef(amount);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totlaBalance) {
      setAmount(totlaBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  useEffect(() => {
    // generate random number----------
    const generateRandomNumbers = () => {
      const numbers = [];
      for (let i = 0; i < 9; i++) {
        numbers.push(Math.floor(Math.random() * cols) + 1);
      }
      setRandomNumbers(numbers);
    };

    // select game level---------------
    if (level === "easy") {
      setCols(4);
    } else if (level === "medium") {
      setCols(3);
    } else if (level === "hard") {
      setCols(2);
    }
    generateRandomNumbers();
  }, [level, cols]);

  return (
    <div>
      <div className="flex flex-wrap-reverse m-auto  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <div className="w-[100%]  lg:w-[30%]  p-6 h-screen/2 bg-[#213743]">
          <div className="w-full flex space-x-2 bg-gray-800 rounded-full px-2 py-2">
            <button
              onClick={() => handleClick("Manual")}
              className={`relative w-full px-6 py-2 rounded-full overflow-hidden  font-medium   transition-all  ${
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

            {/* <button
              onClick={() => handleClick("Auto")}
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
            </button> */}
          </div>
          <div>
            <div className="flex mt-1 justify-between dark:text-gray-200">
              <p className="lg:text-xs font-medium">Bet Amount</p>
              <p className="lg:text-xs flex gap-1 justify-center items-center">
                ₹{Number(totlaBalance).toFixed(2)}{" "}
                <IoReloadCircle
                  className="cursor-pointer"
                  size={17}
                  //   onClick={() => GetUserDetails()}
                />
              </p>
            </div>
            <div className="flex relative mt-0.5 items-center">
              <input
                className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                placeholder="Enter Amount "
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="absolute right-0.5 ">
                <button
                  onClick={() => {
                    if (amount > 1) {
                      setAmount((pre) => pre / 2);
                    } else {
                      setAmount(1);
                    }
                  }}
                  className="px-1.5  py-2 bg-[#2f4553] text-gray-200   text-xs  font-medium  "
                >
                  1/2
                </button>
                <button
                  onClick={() => doubleTheAmount()}
                  className="px-1.5  py-2 bg-[#2f4553] text-gray-200 border-l-2 text-xs cursor-pointer font-medium border-gray-200"
                >
                  2x
                </button>
              </div>
            </div>
            <p className="mt-3 lg:mt-2 lg:text-xs dark:text-gray-200 font-medium">
              Difficulty
            </p>
            <select
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded border-2 mt-0.5 border-[#2f4553] px-2  py-2 focus:outline-none  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium"> Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button className="w-full rounded bg-[#20e701] font-semibold py-2 text-sm mt-3">
            Bet
          </button>
        </div>
        <div
          id=""
          className=" relative w-[100%]  lg:w-[70%] bg-cover bg-black  p-6 h-screen/2  "
          style={{
            backgroundImage: `url(${bg1})`,
          }}
        >
          {/* dragon img */}
          <img
            alt="dragon"
            className="m-auto h-20"
            src={require("../../assets/photos/dragon1.png")}
          />
          <div className="bg-[#56687a] p-2 w-[70%] m-auto rounded-lg">
            {randomNumbers.map((item, index) => (
              <div key={index} className="flex justify-around">
                {Array.from({ length: cols }).map((_, innerIndex) => (
                  <button
                    key={innerIndex}
                    className={`mb-2 h-10 rounded w-[${Math.floor(
                      100 / cols - 1
                    )}%]`}
                    style={{
                      backgroundImage: `url(${bg2})`,
                    }}
                  ></button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
