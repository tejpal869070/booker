import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { GetUserDetails } from "../../../Controllers/User/UserController";
import { MinesGameUpdateWallet } from "../../../Controllers/User/GamesController";

const ManualMode = ({
  handleSpin,
  selectedColor,
  gameStarted,
  isWin,
  handleGameType,
}) => {
  const [amount, setAmount] = useState(100);
  const [isSpining, setSpining] = useState(false);
  const [totalBalance, setTotalBalance] = useState(); // Fixed spelling here
  const [gameType, setGameType] = useState("low");

  const amountRef = useRef(amount);

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

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setTotalBalance(Number(response[0].color_wallet_balnace));
    } else {
      window.location.href = "/";
    }
  };

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totalBalance) { // Fixed spelling here
      setAmount(totalBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  const handleSpinClick = async () => {
    if (amountRef.current > totalBalance || amountRef.current === 0) { // Fixed spelling here
      toast.warn("Insufficient Balance", {
        position: "top-center",
      });
      return;
    }
    handleSpin(amountRef.current);
    setTotalBalance((pre) => pre - amountRef.current); // Fixed spelling here
    await updateWalletBalance("deduct", amountRef.current);
  };

  const selectGameType = (e) => {
    setGameType(e.target.value);
    handleGameType(e.target.value);
  };

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  useEffect(() => {
    if (gameStarted) {
      setSpining(true);
    } else {
      setSpining(false);
    }
  }, [gameStarted]);

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

  return (
    <div>
      <ToastContainer />
      <div>
        <div className="flex justify-between dark:text-gray-200">
          <p className="lg:text-sm font-medium">Bet Amount</p>
          <p>₹{Number(totalBalance).toFixed(2)}</p> {/* Fixed spelling here */}
        </div>
        <div className="flex relative items-center">
          <input
            className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
            placeholder="Enter Amount "
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))} // Convert to number
          />
          <div className="absolute right-0.5 ">
            <button
              onClick={() => setAmount((pre) => pre / 2)}
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
        <p className="lg:text-sm font-medium  dark:text-gray-200 mt-3">Risk</p>
        <select
          value={gameType}
          onChange={(e) => selectGameType(e)} // Changed to onChange
          className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option> 
          <option value="high">High</option>
        </select>
      </div>
      <button
        className="mt-8 px-6 py-3 bg-[#20E701] w-full text-[#05080A] text-lg font-semibold rounded-lg  transition"
        onClick={() => handleSpinClick()}
        disabled={isSpining}
      >
        Bet
      </button>
      {/* <button
        className="mt-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
        onClick={() => handleReset()}
      >
        Reset
      </button> */}
    </div>
  );
};

export default ManualMode;