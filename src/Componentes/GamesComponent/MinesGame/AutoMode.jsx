import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { mines } from "../../../assets/Data/GamesData";
import { ToastContainer, toast } from "react-toastify";
import { minesProfitTable } from "../../../assets/Data/MinesData";
import { GetUserDetails } from "../../../Controllers/User/UserController";
import { AiOutlineAreaChart } from "react-icons/ai";
import Graph from "./Graph";
import { EncryptTimestamp } from "../../../Controllers/Auth/EncryptTimestamp";
import { MinesGameUpdateWallet } from "../../../Controllers/User/GamesController";

export default function AutoMode({ isBetPlacedFunction }) {
  const [totalBombs, setTotalBombs] = useState(1);
  const [amount, setAmount] = useState(100);
  const [totlaBalance, setTotalBalance] = useState();
  const [userSelectedIndex, setUserSelectedIndex] = useState([]);
  const [isAutoBetStart, setAutoBetStart] = useState(false);
  const [bombIndex, setBombIndex] = useState([]);
  const [diamndIndex, setDiamondIndex] = useState([]);
  const [totalBets, setTotalBets] = useState(0);
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
  const [isBetLossed, setBetLossed] = useState(false);
  const [isGraph, setIsGraph] = useState(false);
  const initialBetAmount = amount;

  // graph datat
  const [wageredAmount, setWegeredAmount] = useState(0);
  const [graphProfit, setGraphProfit] = useState(0);
  const [totalWin, setTotalWin] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);

  const [betAmountWin, setBetAmountWin] = useState();

  const userDataGet = async () => { 
    const response = await GetUserDetails();
    if (response !== null) {
      const newBalance = Number(response[0].color_wallet_balnace);
      setTotalBalance(newBalance);
      setStartingBalance(newBalance);
    } else {
      window.location.href = "/";
    }
  };

  const formData = {};
  const updateWalletBalance = async (type, amount) => {
    formData.type = type;
    formData.amount = amount;

    try {
      const response = MinesGameUpdateWallet(formData);
      if (response.status) {
      }
    } catch (error) {
      if (error.response.status === 302) {
        toast.error(error.response.data.message, {
          position: "top-center",
        });
      } else {
        toast.error("Server Error");
      }
    }
  };

  const handleCardClick = (item) => {
    const maxSelectable = 25 - totalBombs; // Calculate the maximum selectable cards

    setUserSelectedIndex((prev) => {
      const newIndex = prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : prev.length < maxSelectable
        ? [...prev, item.id]
        : prev;

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

  const autoFunction = async () => {
    setAllOpen(true);
    handleWallet("deduct");
    updateWalletBalance("deduct", amountRef.current);
    if (userSelectedIndex.some((item) => bombIndexRef.current.includes(item))) {
      setTotalLoss((pre) => pre + 1);
      setGraphProfit((pre) => pre - amountRef.current);
      const audio = new Audio(require("../../../assets/audio/blast1.mp3"));
      audio.play();
      setAmount((pre) => pre + (pre * Number(increaseOnLoss)) / 100);
      setBetLossed(true);
    } else {
      setBetWin(true);
      setBetAmountWin(amountRef.current);
      setTotalWin((pre) => pre + 1);
      setGraphProfit(
        (pre) =>
          pre +
          amountRef.current *
            minesProfitTable.find((item) => item.totalBomb === totalBombs)
              .profit[userSelectedIndex.length - 1]?.profit -
          amountRef.current
      );

      setBetLossed(false);
      if (increaseOnWin > 0) {
        setAmount((pre) => pre + (pre * Number(increaseOnWin)) / 100);
      } else {
        setAmount(initialBetAmount);
      }
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
    }, 1500);
  };

  const handleWallet = async (type) => {
    if (type === "deduct") {
      if (!betWin) {
        setTotalBalance((prevBalance) => prevBalance - amountRef.current);
      }
    } else if (type === "add") {
      updateWalletBalance(
        "add",
        amountRef.current *
          minesProfitTable.find((item) => item.totalBomb === totalBombs).profit[
            userSelectedIndex.length - 1
          ]?.profit
      );
      const calculatedProfit = minesProfitTable.find(
        (item) => item.totalBomb === totalBombs
      ).profit[userSelectedIndex.length - 1]?.profit;

      setProfit(
        minesProfitTable.find((item) => item.totalBomb === totalBombs).profit[
          userSelectedIndex.length - 1
        ]?.profit
      );
      setTotalBalance(
        (prevBalance) => prevBalance + amountRef.current * calculatedProfit
      );
    }
  };

  const handleAutoStart = () => {
    if (stopLoss < amountRef.current && stopLoss > 0) {
      toast.error(
        "The stop-loss target cannot be lower than the current bet amount."
      );
      return;
    }
    setAutoBetStart(true);
    let currentBet = 0;

    const startBetting = () => {
      if (stopProfit > 0 || stopLoss > 0 || totalBets == 0) {
        const infiniteBetting = () => {
          if (balanceRef.current < amountRef.current) {
            stopAutoBet();
            toast.warn("Insufficient funds");
            return;
          }
          setWegeredAmount((pre) => pre + amountRef.current);
          currentBet++;
          const currentBalance = balanceRef.current;
          if (
            currentBalance >= Number(startingBalance) + Number(stopProfit) &&
            Number(stopProfit) > 0
          ) {
            stopAutoBet();
          } else if (
            currentBalance <= Number(startingBalance) - Number(stopLoss) &&
            Number(stopLoss) > 0
          ) {
            stopAutoBet();
          } else {
            autoFunction();
            timeoutRef.current.push(setTimeout(infiniteBetting, 2000));
          }
        };
        infiniteBetting();
      } else {
        const startRegularBetting = () => {
          if (balanceRef.current < amountRef.current) {
            stopAutoBet();
            toast.warn("Insufficient funds");
            return;
          }
          if (currentBet < totalBets) {
            autoFunction();
            currentBet++;
            setWegeredAmount((pre) => pre + amountRef.current);
            timeoutRef.current.push(setTimeout(startRegularBetting, 2000));
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
    userDataGet();
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
    if (25 - userSelectedIndex.length < totalBombs) {
      setUserSelectedIndex([]);
    }
  }, [totalBombs, userSelectedIndex]);

  useEffect(() => {
    userDataGet();
  }, []);

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach(clearTimeout);
      timeoutRef.current = [];
    };
  }, []);

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > balanceRef.current) {
      setAmount(balanceRef.current);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

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
                    ? "bg-[#9000FF] border-b-4 border-[#7100C7]"
                    : "bg-gray-300"
                }  `}
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
                <div className="rounded-lg animate-jump-in p-4 border-2 bg-[#16242C] w-40 py-4 px-6 border-[#28A73C] flex flex-col gap-2 justify-center items-center">
                  <p className="text-center text-[#20E701] font-semibold text-lg lg:text-3xl">
                    {profit}x
                  </p>
                  <p className="text-center text-[#20E701] font-semibold text-lg border-t-2 border-gray-400 pt-0.5">
                    +₹
                    {Number(
                      Number(betAmountWin) *
                        Number(
                          minesProfitTable.find(
                            (item) => item.totalBomb === totalBombs
                          ).profit[userSelectedIndex.length - 1]?.profit
                        )
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  }, [
    userSelectedIndex,
    isAutoBetStart,
    isAllOpen,
    betWin,
    bombIndex,
    betAmountWin,
  ]);

  return (
    <div>
      <ToastContainer /> 
      <div>
        <div className="flex justify-between dark:text-gray-200">
          <p className="lg:text-sm font-medium">Bet Amount</p>
          <p>₹{Number(totlaBalance).toFixed(2)}</p>
        </div>
        <div className="flex relative items-center">
          <input
            className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
            placeholder="Enter Amount "
            value={isAutoBetStart ? Number(amount).toFixed(2) : amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={isAutoBetStart}
            type="number"
          />
          <div className="absolute right-0.5   ">
            <button
              onClick={() => setAmount((pre) => pre / 2)}
              className="px-1.5  py-1.5 bg-gray-500 text-gray-200   text-sm  font-medium  "
            >
              1/2
            </button>
            <button
              onClick={() => doubleTheAmount()}
              className="px-1.5  py-1.5 bg-gray-500 text-gray-200 border-l-2 text-sm  font-medium border-gray-200"
            >
              2x
            </button>
          </div>
        </div>
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
            type="number"
            disabled={isAutoBetStart}
            onChange={(e) => setTotalBets(e.target.value)}
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
              x
              {minesProfitTable.find((item) => item.totalBomb === totalBombs)
                .profit[userSelectedIndex.length - 1]?.profit || 0}
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
            disabled={userSelectedIndex.length === 0}
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
          type="number"
          value={stopProfit}
          disabled={isAutoBetStart}
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
          type="number"
          disabled={isAutoBetStart}
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
            type="number"
            value={increaseOnWin}
            disabled={isAutoBetStart}
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
            type="number"
            value={increaseOnLoss}
            disabled={isAutoBetStart}
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
      <div className="flex items-center justify-between px-4 py-2 mt-1 rounded bg-gray-900">
        <AiOutlineAreaChart
          size={24}
          color="white"
          className="cursor-pointer"
          onClick={() => setIsGraph((pre) => !pre)}
        />
      </div>

      {isGraph && (
        <Graph
          wageredAmount={wageredAmount}
          graphProfit={graphProfit}
          totalWin={totalWin}
          totalLoss={totalLoss}
          handleClose={() => setIsGraph(false)}
          resetGraph={() => {
            setWegeredAmount(0);
            setGraphProfit(0);
            setTotalWin(0);
            setTotalLoss(0);
          }}
        />
      )}
    </div>
  );
}