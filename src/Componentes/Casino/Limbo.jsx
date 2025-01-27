import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import AutoMode from "../GamesComponent/MinesGame/AutoMode";
import Manual from "../GamesComponent/Limbo/Manual";
// import Board from "../GamesComponent/Limbo/Board";
import { toast, ToastContainer } from "react-toastify";
import CountUp from "react-countup";
import HistoryTop from "../GamesComponent/Limbo/HistoryTop";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { MinesGameUpdateWallet } from "../../Controllers/User/GamesController";
import GameHistory from "../GamesComponent/Limbo/GameHistory";

export default function Limbo() {
  const [selected, setSelected] = useState("Manual");
  const [isBetPlaced, setIsBetPlaced] = useState();
  const [amount, setAmount] = useState(100);
  const [totlaBalance, setTotalBalance] = useState();
  const [randomNumber, setRandomNumber] = useState();
  const [target, setTarget] = useState(1.01);
  const [history, setHistory] = useState([]);
  const [winChance, setWinChance] = useState();
  const [isAutoBetStart, setAutoBetStart] = useState(false);
  const [isManualBetStart, setManualBetStart] = useState(false);
  const [stopLoss, setStopLoss] = useState(0);
  const [stopProfit, setStopProfit] = useState(0);
  const [increaseOnWin, setIncreaseOnWin] = useState(0);
  const [increaseOnLoss, setIncreaseOnLoss] = useState(0);
  const [totalBets, setTotalBets] = useState(0);
  const [user, setUser] = useState();
  const [isWin, setWin] = useState();
  const [playedGames, setPlayedGames] = useState(0);
  const [gameToWin, setGameToWin] = useState(0);
  const intervalId = useRef(null);

  const handleClick = (type) => {
    setSelected(type);
    setPlayedGames(0);
  };

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totlaBalance) {
      setAmount(totlaBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  const isBetPlacedFunction = (betPlaced) => {
    if (betPlaced) {
      setIsBetPlaced(true);
    } else {
      setIsBetPlaced(false);
    }
  };

  const handleBetPlace = async () => {
    if (selected === "Manual") {
      await betFunction();
    } else {
      intervalId.current = setInterval(async () => {
        await betFunction();
        if (Number(playedGames) === Number(totalBets)) {
          stopAutoBet();
          clearInterval(intervalId.current);
        }

        console.log(playedGames, totalBets);
      }, 2000);
    }
  };

  const stopAutoBet = () => {
    setAutoBetStart(false);
    setPlayedGames(0);
    clearInterval(intervalId.current);
  };

  const betFunction = async () => {
    if (amount < 1 || target < 1.01) {
      toast.error("Min. amount is ₹1 & target is 1.01", {
        position: "top-center",
      });
      stopAutoBet();
      return;
    } else if (amount > totlaBalance) {
      toast.error("Insufficient balance", {
        position: "top-center",
      });
      stopAutoBet();
      return;
    }
    setPlayedGames(playedGames + 1);
    setManualBetStart(true);
    setAutoBetStart(true);
    await updateWalletBalance("deduct", amount);
    setRandomNumber(1);
    if (playedGames === gameToWin) {
      const randomNumber = (
        Math.random() * Number(target) +
        Number(target)
      ).toFixed(2);
      setRandomNumber(parseFloat(randomNumber));
      setHistory((prevData) => [...prevData, { target, randomNumber }]);
      setPlayedGames(0);
      updateBalanceShow(randomNumber);
      generateGameToWin();
    } else {
      const randomNumber = 1 + Math.random() * (target - 1);
      setRandomNumber(parseFloat(randomNumber.toFixed(2)));
      setHistory((prevData) => [...prevData, { target, randomNumber }]);
      updateBalanceShow(randomNumber);
    }
    setTimeout(() => {
      setManualBetStart(false);
      setAutoBetStart(false);
    }, 1000);
  };

  const updateBalanceShow = async (randomNumber) => {
    if (Number(randomNumber) >= Number(target)) {
      await updateWalletBalance("add", amount * target);
      setWin(true);
    } else {
      setWin(false);
    }
  };

  // update wallet balance online---------------------------------------------
  const formData = {};
  const updateWalletBalance = async (type, amount) => {
    formData.type = type;
    formData.amount = amount;
    formData.game_type = "Limbo";
    formData.uid = user?.uid;

    try {
      const response = await MinesGameUpdateWallet(formData);
      if (response && response.status) {
      }
    } catch (error) {
      if (error?.response?.status === 302) {
        toast.error(error.response.data.message, {
          position: "top-center",
        });
      } else {
        toast.error("Server Error");
      }
    } finally {
      userDataGet();
    }
  };

  const amountRef = useRef(amount);
  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setTotalBalance(Number(response[0].color_wallet_balnace));
      setUser(response[0]);
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  const generateGameToWin = useCallback(() => {
    const gameToWin = Math.floor(Math.random() * (Number(target) + 1)) + 1;
    setGameToWin(gameToWin);
  }, [target]);

  useEffect(() => {
    generateGameToWin();
  }, [generateGameToWin, target]);

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="min-h-screen ">
      <ToastContainer />
      {/* {isFlashPopup && <FlashPopup handleClose={handleClose} />} */}
      <div className="flex flex-wrap-reverse m-auto rounded-lg overflow-hidden  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <div className="w-[100%]  lg:w-[30%]  p-6 h-screen/2 bg-gray-500">
          <div className="w-full flex space-x-2 bg-gray-800 rounded-full px-2 py-3">
            <button
              onClick={() => handleClick("Manual")}
              disabled={isAutoBetStart || isManualBetStart}
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
              // onClick={() => handleClick("Auto")}
              // disabled={isAutoBetStart || isManualBetStart}
              disabled
              className={`cursor-not-allowed relative w-1/2 px-6 py-2 rounded-full overflow-hidden  font-medium transition-all  ${
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
            <div>
              <div className="flex justify-between dark:text-gray-200">
                <p className="lg:text-sm font-medium">Bet Amount</p>
                <p>₹{totlaBalance}</p>
              </div>
              <div className="flex relative items-center">
                <input
                  className="w-full text-gray-800 rounded border-2  border-gray-200 px-2 py-1  focus:outline-none font-semibold text-lg"
                  placeholder="Enter Amount "
                  value={amount}
                  type="number"
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
                className="w-full text-gray-200 rounded border px-2 py-0.5  outline-none font-semibold text-lg"
                placeholder="Enter Amount "
                disabled
                value={(amount * target - amount).toFixed(2)}
              />
              <button
                onClick={() => handleBetPlace()}
                disabled={isManualBetStart}
                className="w-full rounded bg-[#20e701] font-semibold text-lg text-gray-700 py-2 mt-3"
              >
                Place Bet
              </button>
            </div>
          ) : (
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
                Number of Bets
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
                  // disabled={isAutoBetStart}
                  onChange={(e) => setTotalBets(e.target.value)}
                />
              )}

              {isAutoBetStart ? (
                <button
                  onClick={() => stopAutoBet()}
                  className={`w-full rounded font-semibold text-lg text-white py-2 mt-3 bg-green-400`}
                >
                  Stop Auto Bet
                </button>
              ) : (
                <button
                  onClick={() => handleBetPlace()}
                  disabled={target < 1.01 || amount < 1}
                  className={`w-full rounded font-semibold text-lg text-[#2f2e2e] py-2 mt-3 bg-[#20e701]  `}
                >
                  Start Auto Bet
                </button>
              )}

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
            </div>
          )}
        </div>
        <div className=" relative w-[100%]  lg:w-[70%]  px-6 py-2 h-screen/2 bg-gray-600">
          <div className="min-h-[40vh] md:min-h-[60vh] relative">
            <HistoryTop history={history} />
            <div className="mt-20  flex justify-center  items-center w-full h-full">
              <p
                className={`text-8xl text-center font-semibold ${
                  isWin ? "text-[#00e701]" : "text-red-500"
                }`}
              >
                {/* {randomNumber.toFixed(2)}x */}
                <CountUp end={randomNumber} decimals={2} duration={1} />x
              </p>
            </div>
            <div className="absolute bottom-0 flex justify-between items-center w-full bg-gray-700 rounded p-2 ">
              <div className="w-[50%]">
                <p className="text-sm text-gray-300 mb-1 font-medium">
                  Target Multipiler
                </p>
                <input
                  value={target}
                  type="number"
                  disabled={isAutoBetStart || isManualBetStart}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-[95%] pl-2 text-gray-200 text-sm py-1 bg-gray-900 border-gray-500 border-2 rounded outline-none focus:border-0"
                />
              </div>
              <div className="w-[50%]">
                <p className="text-sm text-gray-300 mb-1 font-medium">
                  Win Chance
                </p>
                <input
                  value={winChance}
                  type="number"
                  disabled
                  className="w-[95%] pl-2 text-gray-200 text-sm py-1 bg-gray-900 border-gray-500 border-2 rounded outline-none focus:border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="m-auto mt-6  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <GameHistory type={"limbo"} />{" "}
      </div> */}
    </div>
  );
}
