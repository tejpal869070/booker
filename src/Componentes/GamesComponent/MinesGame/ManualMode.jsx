import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { mines } from "../../../assets/Data/GamesData";
import { GetUserDetails } from "../../../Controllers/User/UserController";
import { MinesGameUpdateWallet } from "../../../Controllers/User/GamesController";
import { ToastContainer, toast } from "react-toastify";
import { minesProfitTable } from "../../../assets/Data/MinesData";
import { EncryptTimestamp } from "../../../Controllers/Auth/EncryptTimestamp";

export default function ManualMode({ isBetPlacedFunction, isRecharged }) {
  const [amount, setAmount] = useState(100);
  const [totalBombs, setTotalBombs] = useState(1);
  const [totlaBalance, setTotalBalance] = useState();
  const [bombIndex, setBombIndex] = useState([]);
  const [diamndIndex, setDiamondIndex] = useState([]);
  const [openedMines, setOpenedMines] = useState([]);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const [bombFound, setBombFound] = useState(false);
  const [isCashOut, setCashOut] = useState(false);
    const [user, setUser] = useState({});
  

  // admin controller start------------------------------------------------------------------------------------------------------------
  const [totalGamePlayed, setTotalGamePlayed] = useState(0);
  const [gameNumberToLoss, setGameNumberToLoss] = useState(0);
  const [thisGameWillLoss, setThisGameLoss] = useState(false);

  const bombIndexRef = useRef(bombIndex);
  const diamondIndexeRef = useRef(diamndIndex);
  useEffect(() => {
    bombIndexRef.current = bombIndex;
    diamondIndexeRef.current = diamndIndex;
  }, [bombIndex, diamndIndex]);
  // admin controller ENd------------------------------------------------------------------------------------------------------------

  const amountRef = useRef(amount);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const formData = {};

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setTotalBalance(Number(response[0].color_wallet_balnace));
      setUser(response[0]);
    } else {
      window.location.href = "/";
    }
  };

  // update wallet balance online-------------
  const updateWalletBalance = async (type, amount) => {
    formData.type = type;
    formData.amount = amount;
    formData.game_type = "Mines";
    formData.uid = user?.uid;

    try { 
      const response = await MinesGameUpdateWallet(formData);
      if (response.status) {
      }
    } catch (error) {
      if (error?.response?.status === 302) {
        toast.error(error.response.data.message, {
          position: "top-center",
        });
      } else {
        toast.error("Server Error");
      }
    }
  };

  const resetGame = () => {
    setOpenedMines([]);
    setBombFound(false);
    generateRandom();
    // admin controller start------------------------------------------------------------------------------------------------------------
    if (thisGameWillLoss) {
      setThisGameLoss(false);
      generateGameToBeLoss();
      setTotalGamePlayed(0);
    }
    // admin controller end------------------------------------------------------------------------------------------------------------
  };

  const handleBetPlace = async () => {
    await userDataGet();
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid Bet Amount", { position: "top-center" });
      return;
    }

    if (amount > totlaBalance) {
      toast.error("Insufficient Balance", { position: "top-center" });
      return;
    }
    // admin controller start------------------------------------------------------------------------------------------------------------
    setTotalGamePlayed((pre) => pre + 1); 
    if (totalGamePlayed+1  === gameNumberToLoss) {
      setThisGameLoss(true); 
    }
    // admin controller end------------------------------------------------------------------------------------------------------------
    setIsBetPlaced(true);
    updateWalletBalance("deduct", amount);
    setTotalBalance((pre) => pre - amount);
  };

  const handleCashOut = async () => {
    setCashOut(true);
    setBombFound(true);
    const audio = new Audio(require("../../../assets/audio/successSound.mp3")); // or use a URL
    audio.play();
    setIsBetPlaced(false);
    setTotalBalance(
      totlaBalance +
        amount *
          minesProfitTable.find((item) => item.totalBomb === totalBombs).profit[
            openedMines.length - 1
          ]?.profit || 0
    );
    await updateWalletBalance(
      "add",
      amount *
        minesProfitTable.find((item) => item.totalBomb === totalBombs).profit[
          openedMines.length - 1
        ]?.profit || 0
    );
    await userDataGet();
    setTimeout(() => {
      setCashOut(false);
      resetGame();
    }, 2000);
  };

  const handleCardClick = (item) => {
    // admin controller start------------------------------------------------------------------------------------------------------------
    const allMines = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25,
    ];
    if (thisGameWillLoss) {
      if (bombIndexRef.current.length === 1) {
        bombIndexRef.current = [item.id];
        const newDiamondIndex = allMines.filter((i) => i != item.id);
        diamondIndexeRef.current = newDiamondIndex;
      } else {
        if (!bombIndexRef.current.includes(item.id)) {
          const currentBombIndexs = bombIndexRef.current; 
          const lastBombRemoved = currentBombIndexs.pop()
          bombIndexRef.current = [...currentBombIndexs, item.id];
          diamondIndexeRef.current = diamondIndexeRef.current.filter((i)=> i != item.id);
          diamondIndexeRef.current = [...diamondIndexeRef.current, lastBombRemoved]
        }
      }
    }
    // admin controller end------------------------------------------------------------------------------------------------------------
    setOpenedMines((pre) => [...pre, item.id]);
    if (bombIndexRef.current.includes(item.id)) { 
      setBombFound(true);
      setIsBetPlaced(false);
      const audio = new Audio(require("../../../assets/audio/blast1.mp3"));
      audio.play();
      setTimeout(() => {
        resetGame();
      }, 2000);
    } else {
      const audio = new Audio(require("../../../assets/audio/success1.mp3"));
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
    userDataGet();
  }, [isRecharged]);

  useEffect(() => {
    generateRandom();
  }, [totalBombs]);

  useEffect(() => {
    isBetPlacedFunction(isBetPlaced);
  }, [isBetPlaced]);

  useEffect(() => {
    userDataGet();
  }, []);

  useEffect(() => {
    if (!bombFound && openedMines.length === 25 - totalBombs) {
      handleCashOut();
    }
  }, [openedMines, totalBombs, bombFound]);

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totlaBalance) {
      setAmount(totlaBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  // admin controller start------------------------------------------------------------------------------------------------------------
  const generateGameToBeLoss = () => {
    const randomNum = Math.floor(Math.random() *5) + 1;
    setGameNumberToLoss(randomNum); 
  };
  useEffect(() => {
    generateGameToBeLoss();
  }, []);
  // admin controller end------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    const element = document.getElementById("boxBoard");
    if (element) {
      ReactDOM.createRoot(element).render(
        <div className="relative">
          <div className=" grid  grid-cols-5 gap-2 px-4 py-3  ">
            {mines.map((item, index) => (
              <button
                onClick={() => handleCardClick(item)}
                disabled={
                  !isBetPlaced ||
                  openedMines.includes(item.id) ||
                  openedMines.length === 25 - totalBombs
                }
                key={index}
                className={`w-full h-16 flex justify-center items-center shadow-lg lg:h-28 bg-gray-300 rounded-xl `}
              >
                {bombFound ? (
                  diamondIndexeRef.current.includes(item.id) ? (
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
                  diamondIndexeRef.current.includes(item.id) ? (
                  <img
                    className="m-auto w-12 "
                    src={require("../../../assets/photos/diamond.png")}
                  />
                ) : openedMines.includes(item.id) &&
                  bombIndexRef.current.includes(item.id) ? (
                  <img
                    className="m-auto w-12"
                    src={require("../../../assets/photos/time-bomb.png")}
                  />
                ) : null}
              </button>
            ))}
          </div>
          {isCashOut && (
            <div className="absolute flex animate-jump-in backdrop-blur-[1px] justify-center items-center top-0 left-0 right-0 bottom-0 w-full h-full">
              <img
                alt="banner"
                className="w-[400px]"
                src={require("../../../assets/photos/winimg.png")}
              />
              <p className="absolute mt-24 font-bold text-2xl text-[#13b70a]">
                +₹
                {(
                  Number(amount) *
                  (minesProfitTable.find(
                    (item) => item.totalBomb === totalBombs
                  )?.profit[openedMines.length - 1]?.profit || 0)
                ).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      );
    }
  }, [
    openedMines,
    isBetPlaced,
    bombIndexRef.current,
    diamondIndexeRef.current,
  ]);

  return (
    <div>
      <ToastContainer />
      <div>
        {isBetPlaced ? (
          <div className="mt-4">
            <div className="flex justify-between">
              <p className="font-medium">
                Bombs:{" "}
                <span className="text-lg lg:text-md text-red-400">
                  {totalBombs}
                </span>
              </p>{" "}
              <p className="font-medium">
                Balance:{" "}
                <span className="text-lg lg:text-md text-green-400">
                  ₹{totlaBalance}
                </span>
              </p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">
                Bet Amt.: <span className="text-lg lg:text-md">₹{amount}</span>
              </p>{" "}
              <p className="font-medium">
                Profit:{" "}
                <span className="text-lg lg:text-md text-green-400">
                  x
                  {minesProfitTable.find(
                    (item) => item.totalBomb === totalBombs
                  ).profit[openedMines.length - 1]?.profit || 0}
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
            <div className="flex relative items-center">
              <input
                className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
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
                ₹
                {(
                  Number(amount) *
                  (minesProfitTable.find(
                    (item) => item.totalBomb === totalBombs
                  )?.profit[openedMines.length - 1]?.profit || 0)
                ).toFixed(2)}
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
