import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { GetUserDetails } from "../../../Controllers/User/UserController";
import { MinesGameUpdateWallet } from "../../../Controllers/User/GamesController";

export default function AutoMode({
  handleSpin,
  stopAutoBet,
  isWin,
  selectedColor,
}) {
  const [amount, setAmount] = useState(100);
  const [totlaBalance, setTotalBalance] = useState(0);
  const [totalBets, setTotalBets] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [stopProfit, setStopProfit] = useState(0);
  const [increaseOnWin, setIncreaseOnWin] = useState(0);
  const [increaseOnLoss, setIncreaseOnLoss] = useState(0);
  const [isAutoBetStart, setAutoBetStart] = useState(false);

  const amountRef = useRef(amount);
  const balanceRef = useRef(totlaBalance);

  // update wallet balance online---------------------------------------------
  const formData = {};
  const updateWalletBalance = async (type, amount) => {
    formData.type = type;
    formData.amount = amount;

    try {
      const response = await MinesGameUpdateWallet(formData);
      if (response.status) {
        // Handle successful response if needed
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

  const handleSpinClick = async () => {
    if (amountRef.current > totlaBalance || amountRef.current === 0) {
      toast.warn("Insufficient Balance", {
        position: "top-center",
      });
      return;
    }
    setAutoBetStart(true);
    handleSpin(
      amountRef.current,
      stopProfit,
      stopLoss,
      balanceRef.current,
      totalBets
    );
    setTotalBalance((pre) => pre - amountRef.current);
    await updateWalletBalance("deduct", amountRef.current);
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setTotalBalance(Number(response[0].color_wallet_balnace));
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  useEffect(() => {
    balanceRef.current = totlaBalance;
  }, [totlaBalance]);

  useEffect(() => {
    const updateBalance = async () => {
      if (isWin) {
        if (selectedColor?.profit !== 0.0) {
          setTotalBalance(
            (pre) => pre + amountRef.current * selectedColor?.profit
          );
          await updateWalletBalance(
            "add",
            amountRef.current * selectedColor?.profit
          );
        }
      }
    };

    updateBalance();
  }, [selectedColor, isWin]);

  useEffect(() => {
    userDataGet();
  }, []);

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > balanceRef.current) {
      setAmount(balanceRef.current);
    } else {
      setAmount((pre) => pre * 2);
    }
  };
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
            className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
            placeholder="Enter Amount "
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
        {/* {stopLoss > 0 || stopProfit > 0 ? (
          <p className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg">
            ♾️
          </p>
        ) : ( */}
        <input
          className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
          placeholder="Enter Bets Number "
          type="number"
          value={totalBets}
          onChange={(e) => setTotalBets(e.target.value)}
        />
        {/* )} */}

        {isAutoBetStart ? (
          <button
            onClick={() => stopAutoBet()}
            className={`w-full rounded font-semibold text-lg text-white py-2 mt-3 bg-red-500`}
          >
            Stop Auto Bet
          </button>
        ) : (
          <button
            className={`w-full rounded font-semibold text-lg bg-[#20E701]   text-[#05080A] py-2 mt-3  `}
            onClick={() => handleSpinClick()}
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
          className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
          placeholder="0.0000"
          type="number"
          value={stopProfit}
          onChange={(e) => setStopProfit(e.target.value)}
        />
      </div>
      <div>
        <p className="lg:text-sm text-gray-200 font-medium mt-1 mb-1">
          Stop On Loss
        </p>
        <input
          className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
          placeholder="0.0000"
          type="number"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
        />
      </div>
      <div>
        <p className="lg:text-sm text-gray-200 font-medium mt-1 mb-1">
          Increase on WIN
        </p>
        <div className="relative">
          <input
            className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
            placeholder="0.0000"
            type="number"
            value={increaseOnWin}
            onChange={(e) => setIncreaseOnWin(e.target.value)}
          />
          <p className="absolute right-2 h-full flex items-center justify-center text-gray-800 font-semibold top-0 bottom-0">
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
            className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
            placeholder="0.0000"
            type="number"
            value={increaseOnLoss}
            onChange={(e) => setIncreaseOnLoss(e.target.value)}
          />
          <p className="absolute right-2 h-full flex items-center justify-center text-gray-800 font-semibold top-0 bottom-0">
            %
          </p>
        </div>
      </div>
    </div>
  );
}
