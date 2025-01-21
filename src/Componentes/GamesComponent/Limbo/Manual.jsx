import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import HistoryTop from "./HistoryTop";
import CountUp from 'react-countup';

export default function Manual() {
  const [amount, setAmount] = useState(100);
  const [totlaBalance, setTotalBalance] = useState();
  const [randomNumber, setRandomNumber] = useState();
  const [history, setHistory] = useState([])

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totlaBalance) {
      setAmount(totlaBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  const amountRef = useRef(amount);

  const handleBetPlace = () => {
    setRandomNumber(1)
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setRandomNumber(randomNumber);
    setHistory((prevData) => [...prevData, randomNumber]);
  };

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    console.log(randomNumber);
  }; 

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  useEffect(() => {
    const element = document.getElementById("limboBoard");
    if (element) {
      ReactDOM.createRoot(element).render(
        <div className="min-h-[60vh] relative">
          <HistoryTop history={history}/>
          <div className="mt-20  flex justify-center  items-center w-full h-full">
            <p className="text-8xl text-center font-semibold text-[#00e701]">
              {/* {randomNumber.toFixed(2)}x */}
              <CountUp end={randomNumber} decimals={2} duration={1} />x
            </p>
          </div>
          <div className="absolute bottom-0 flex justify-between items-center w-full bg-gray-700 rounded p-2 ">
            <div className="w-[50%]">
              <p className="text-sm text-gray-300 mb-1 font-medium">
                Target Multipiler
              </p>
              <input className="w-[95%] bg-gray-900 border-gray-500 border-2 rounded outline-none focus:border-0" />
            </div>
            <div className="w-[50%]">
              <p className="text-sm text-gray-300 mb-1 font-medium">
                Win Chance
              </p>
              <input className="w-[95%] bg-gray-900 border-gray-500 border-2 rounded outline-none focus:border-0" />
            </div>
          </div>
        </div>
      );
    }
  }, [randomNumber,history]);

  return (
    <div>
      <div>
        <div className="flex justify-between dark:text-gray-200">
          <p className="lg:text-sm font-medium">Bet Amount</p>
          <p>₹{amount}</p>
        </div>
        <div className="flex relative items-center">
          <input
            className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
            placeholder="Enter Amount "
            // value={amount}
            // onChange={(e) => setAmount(e.target.value)}
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
              className="px-1.5  py-2 bg-gray-500 text-gray-200   text-sm  font-medium  "
            >
              1/2
            </button>
            <button
              onClick={() => doubleTheAmount()}
              className="px-1.5  py-2 bg-gray-500 text-gray-200 border-l-2 text-sm  font-medium border-gray-200"
            >
              2x
            </button>
          </div>
        </div>
        <p className="mt-3 lg:mt-2 lg:text-sm dark:text-gray-200 font-medium">
          Profit On Win
        </p>
        <input
          className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
          placeholder="Enter Amount "
          // value={amount}
          // onChange={(e) => setAmount(e.target.value)}
        />
        <button
          // disabled={isBetPlaced || openedMines.length > 0}
          onClick={() => handleBetPlace()}
          className="w-full rounded bg-green-400 font-semibold text-lg text-white py-2 mt-3"
        >
          Place Bet
        </button>
      </div>
    </div>
  );
}
