import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { mines } from "../../../assets/Data/GamesData";
import { ToastContainer, toast } from "react-toastify";

export default function AutoMode({ isBetPlacedFunction }) {
  const [totalBombs, setTotalBombs] = useState(1);
  const [amount, setAmount] = useState(100);
  const [totlaBalance, setTotalBalance] = useState(1000);
  const [userSelectedIndex, setUserSelectedIndex] = useState([]);
  const [isAutoBetStart, setAutoBetStart] = useState(false);
  const [bombIndex, setBombIndex] = useState([]);
  const [diamndIndex, setDiamondIndex] = useState([]);
  const [totalBets, setTotalBets] = useState(2);
  const [stopLoss, setStopLoss] = useState(0);
  const [stopProfit, setStopProfit] = useState(0);
  const [increaseOnWin, setIncreaseOnWin] = useState(0);
  const [increaseOnLoss, setIncreaseOnLoss] = useState(0);
  const [isAllOpen, setAllOpen] = useState(false);
  const [betWin, setBetWin] = useState(false);
  const bombIndexRef = useRef(bombIndex);
  const [profit, setProfit] = useState(0);
  const timeoutRef = useRef([]);
  const balanceRef = useRef(totlaBalance);
  const amountRef = useRef(amount);
  const [startingBalance, setStartingBalance] = useState(totlaBalance);

  const handleCardClick = (item) => {
    setUserSelectedIndex((prev) => {
      const newIndex = prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id];

      return newIndex;
    });
  };

  useEffect(() => {
    balanceRef.current = totlaBalance;
  }, [totlaBalance]);

  useEffect(() => {
    bombIndexRef.current = bombIndex;
  }, [bombIndex]);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const autoFunction = () => {
    setAllOpen(true);
    handleWallet("deduct");
    if (userSelectedIndex.some((item) => bombIndexRef.current.includes(item))) {
      const audio = new Audio(require("../../../assets/audio/blast1.mp3"));
      audio.play();
      setAmount((pre) => pre + (pre * Number(increaseOnLoss)) / 100);
    } else {
      setBetWin(true);
      setAmount((pre) => pre + (pre * Number(increaseOnWin)) / 100);
      handleWallet("add");
      const audio = new Audio(
        require("../../../assets/audio/successSound.mp3")
      );
      audio.play();
    }

    setTimeout(() => {
      setAllOpen(false);
      setBetWin(false);
      generateRandom();
    }, 1200);
  };

  const handleWallet = (type) => {
    if (type === "deduct") {
      if (!betWin) {
        setTotalBalance((prevBalance) => prevBalance - amountRef.current);
      }
    } else if (type === "add") {
      const calculatedProfit = totalBombs * 1.5 * userSelectedIndex.length;
      if (calculatedProfit > 0) {
        setProfit(calculatedProfit);
        setTotalBalance(
          (prevBalance) => prevBalance + amountRef.current * calculatedProfit
        );
      }
    }
  };

  const handleAutoStart = () => {
    setAutoBetStart(true);
    let currentBet = 0;

    const startBetting = () => {
      if (stopProfit > 0 || stopLoss > 0) {
        const infiniteBetting = () => {
          autoFunction();
          currentBet++;
          const currentBalance = balanceRef.current;
          if (currentBalance >= Number(startingBalance) + Number(stopProfit) && stopProfit > 0) {
            console.log("Stopping betting: Reached stopProfit");
            stopAutoBet();
          } else if (
            currentBalance <= Number(startingBalance) - Number(stopLoss) &&
            Number(stopLoss) > 0
          ) {
            console.log("Stopping betting: Reached stopLoss");
            stopAutoBet();
          } else {
            timeoutRef.current.push(setTimeout(infiniteBetting, 1500));
          }
        };
        infiniteBetting();
      } else {
        const startRegularBetting = () => {
          if (currentBet < totalBets) {
            autoFunction();
            currentBet++;
            timeoutRef.current.push(setTimeout(startRegularBetting, 1500));
          } else {
            stopAutoBet();
          }
        };
        startRegularBetting();
      }
    };

    startBetting();
  };

  const stopAutoBet = () => {
    setStartingBalance(balanceRef.current);
    setAutoBetStart(false);
    setUserSelectedIndex([]);
    generateRandom();
    setAllOpen(false);
    setBetWin(false);
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const generateRandom = () => {
    const allRandomNumbers = new Set();
    while (allRandomNumbers.size < totalBombs) {
      const randomNumber = Math.floor(Math.random() * 25) + 1;
      allRandomNumbers.add(randomNumber);
    }
    const bombIndexes = Array.from(allRandomNumbers);
    const allIndexes = new Set(Array.from({ length: 25 }, (_, i) => i + 1));
    const diamondIndexes = Array.from(
      new Set([...allIndexes].filter((num) => !allRandomNumbers.has(num)))
    );

    setBombIndex(bombIndexes);
    setDiamondIndex(diamondIndexes);
  };

  useEffect(() => {
    generateRandom();
  }, [totalBombs]);

  useEffect(() => {
    isBetPlacedFunction(isAutoBetStart);
  }, [isAutoBetStart]);

  useEffect(() => {
    const element = document.getElementById("boxBoard");
    if (element) {
      const root = ReactDOM.createRoot(element);
      root.render(
        <div className="relative">
          <div className="grid grid-cols-5 gap-2 px-4 py-3">
            {mines.map((item, index) => (
              <button
                disabled={isAutoBetStart}
                onClick={() => handleCardClick(item)}
                className={`w-full h-16 flex justify-center items-center shadow-lg lg:h-28 rounded-xl ${
                  userSelectedIndex.includes(item.id)
                    ? "bg-indigo-300 border-indigo-800 border-4"
                    : "bg-gray-300"
                }`}
              >
                {isAllOpen ? (
                  diamndIndex.includes(item.id) ? (
                    <img
                      className="m-auto w-12 animate-jump-in animate-duration-400"
                      src={require("../../../assets/photos/diamond.png")}
                    />
                  ) : (
                    <img
                      className="m-auto w-16 animate-jump-in animate-duration-400"
                      src={require("../../../assets/photos/time-bomb.png")}
                    />
                  )
                ) : (
                  ""
                )}
              </button>
            ))}
          </div>
          {betWin && (
            <div className="absolute top-0 w-full h-full backdrop-blur-[1px] bg-black/10 flex justify-center items-center">
              <div>
                <div className="rounded-lg animate-jump-in p-4 border-2 bg-[#16242C] w-40 h-20 px-6 border-[#28A73C] flex flex-col justify-center items-center">
                  <p className="text-center text-[#28A73C] font-semibold text-lg lg:text-3xl">
                    {profit}x
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  }, [userSelectedIndex, isAutoBetStart, isAllOpen, betWin, bombIndex]);

  return (
    <div>
      <ToastContainer />
      <div>
        <div className="flex justify-between dark:text-gray-200">
          <p className="lg:text-sm font-medium">Bet Amount</p>
          <p>₹ {Number(balanceRef.current).toFixed(2)}</p>
        </div>
        <input
          className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
          placeholder="Enter Amount "
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={isAutoBetStart}
        />
        <p className="lg:text-sm text-gray-200 font-medium mt-1">
          Number Of Bets
        </p>
        {stopLoss > 0 || stopProfit > 0 ? (
          <p className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]">
            ♾️
          </p>
        ) : (
          <input
            className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
            placeholder="Enter Bets Number "
            value={totalBets}
            disabled={isAutoBetStart}
            onChange={(e) => setTotalBets(Number(e.target.value))}
          />
        )}

        <p className="mt-3 lg:mt-2 lg:text-sm dark:text-gray-200 font-medium">
          Bombs
        </p>
        <div className="flex justify-between ">
          <div className="flex w-1/2 ">
            <button
              disabled={totalBombs === 1 || isAutoBetStart}
              onClick={() => setTotalBombs(totalBombs - 1)}
              className="rounded-l py-1 w-[25%] bg-gray-800 text-gray-200 text-center px-2 cursor-pointer"
            >
              -
            </button>
            <div className="py-1 w-[50%] bg-gray-200 text-gray-800 px-4 text-center">
              {totalBombs}
            </div>
            <button
              disabled={totalBombs === 24 || isAutoBetStart}
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

        {isAutoBetStart ? (
          <button
            onClick={() => stopAutoBet()}
            className={`w-full rounded font-semibold text-lg text-white py-2 mt-3 bg-green-400`}
          >
            Stop Auto Bet
          </button>
        ) : (
          <button
            onClick={() => handleAutoStart()}
            disabled={
              userSelectedIndex.length === 0 || totalBets < 2 || !totalBets
            }
            className={`w-full rounded font-semibold text-lg text-[#2f2e2e] py-2 mt-3 ${
              userSelectedIndex.length > 0 ? "bg-[#61ed4b]" : "bg-gray-400"
            }`}
          >
            Start Auto Bet
          </button>
        )}
      </div>

      <div>
        <p className="lg:text-sm text-gray-200 font-medium mt-1 mb-1">
          Stop On Profit
        </p>
        <input
          className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
          placeholder="0.0000"
          value={stopProfit}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(value)) {
              setStopProfit(value);
            }
          }}
        />
      </div>
      <div>
        <p className="lg:text-sm text-gray-200 font-medium mt-1 mb-1">
          Stop On Loss
        </p>
        <input
          className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
          placeholder="0.0000"
          value={stopLoss}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(value)) {
              setStopLoss(value);
            }
          }}
        />
      </div>
      <div>
        <p className="lg:text-sm text-gray-200 font-medium mt-1 mb-1">
          Increase on WIN
        </p>
        <div className="relative">
          <input
            className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
            placeholder="0.0000"
            value={increaseOnWin}
            onChange={(e) => {
              const value = e.target.value;
              if (!isNaN(value)) {
                setIncreaseOnWin(value);
              }
            }}
          />
          <p className="absolute right-2 h-full flex items-center justify-center text-gray-200 font-semibold top-0 bottom-0">
            %
          </p>
        </div>
      </div>
      <div>
        <p className="lg:text-sm text-gray-200 font-medium mt-1 mb-1">
          Increase on LOSS
        </p>
        <div className="relative">
          <input
            className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
            placeholder="0.0000"
            value={increaseOnLoss}
            onChange={(e) => {
              const value = e.target.value;
              if (!isNaN(value)) {
                setIncreaseOnLoss(value);
              }
            }}
          />
          <p className="absolute right-2 h-full flex items-center justify-center text-gray-200 font-semibold top-0 bottom-0">
            %
          </p>
        </div>
      </div>
    </div>
  );
}
