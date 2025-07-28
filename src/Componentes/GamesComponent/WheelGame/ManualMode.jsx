import React, { useEffect, useRef, useState } from "react";
import GameTypeSelector from "./GameTypeSelector";
import { toast, ToastContainer } from "react-toastify";
import { WheelData } from "../../../assets/Data/WheelData";
import { MinesGameUpdateWallet } from "../../../Controllers/User/GamesController";
import { GetUserDetails } from "../../../Controllers/User/UserController";
import bg1 from "../../../assets/photos/game-bg-2.jpg";

export default function ManualMode({ refreshHistoryFunction }) {
  const [amount, setAmount] = useState(10);
  const [totalBalance, setTotalBalance] = useState(0);
  const [gameType, setGameType] = useState("low");
  const [colors, setColors] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isWin, setWin] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [user, setUser] = useState({});
  const [isProcessingBet, setIsProcessingBet] = useState(false); // New state to prevent double-click

  const amountRef = useRef(amount);

  // Double the bet amount, capped at total balance
  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totalBalance) {
      setAmount(totalBalance);
    } else {
      setAmount((prev) => prev * 2);
    }
  };

  // Handle game type selection
  const selectGameType = (e) => {
    setGameType(e.target.value);
  };

  // Handle the wheel spin logic
  const handleSpinFunction = (betAmount) => {
    const audio = new Audio(require("../../../assets/audio/spin-232536.mp3"));
    audio.play();
    setWin(false);
    setWinAmount(betAmount);
    setGameStarted(true);
    const newRotation = Math.floor(Math.random() * 360) + 1800;
    const totalRotation = currentRotation + newRotation;
    setRotation(-totalRotation);

    const adjustedRotation = totalRotation % 360;
    const angle = (adjustedRotation / 360) * 100;

    if (colors.length > 0) {
      let landedColor;
      if (gameType === "low" || gameType === "medium") {
        const index = Math.floor(
          (adjustedRotation % 360) / (360 / colors.length)
        );
        landedColor = colors[index];
      } else {
        let cumulativeArea = 0;
        landedColor = null;
        for (const color of colors) {
          cumulativeArea += color.area;
          if (angle <= cumulativeArea) {
            landedColor = color;
            break;
          }
        }
      }

      setTimeout(() => {
        setSelectedColor(landedColor);
        setTransitionEnabled(false);
        setCurrentRotation(totalRotation);
        setGameStarted(false);
        setIsProcessingBet(false); // Unlock bet processing
        setWin(true);
        setTimeout(() => {
          setWin(false);
        }, 2000);
      }, 3200);
    }
  };

  // Handle bet placement with double-click prevention
  const handleSpinClick = async () => {
    if (isProcessingBet || gameStarted) {
      return; // Prevent double-click or betting during game
    }

    // Validate bet amount
    if (amount <= 0 || amount > totalBalance) {
      toast.warn(
        <div className="flex justify-center items-center py-4 flex-col gap-2">
          <p>{amount <= 0 ? "Invalid Bet Amount" : "Insufficient Balance"}</p>
          <button
            className="px-2 py-1 rounded-md bg-black text-gray-200"
            onClick={() => {
              const rechargeId = document.getElementById("recharge-button");
              if (rechargeId) {
                rechargeId.click();
              }
            }}
          >
            Recharge Game Wallet
          </button>
        </div>,
        { position: "top-center" }
      );
      return;
    }

    setIsProcessingBet(true); // Lock bet processing
    const walletResponse = await updateWalletBalance("deduct", amount);
    if (walletResponse) {
      toast.success("Bet Placed. Game start", { position: "top-center" });
      handleSpinFunction(amount);
      setTotalBalance((prev) => prev - amount);
      refreshHistoryFunction();
    } else {
      setIsProcessingBet(false); // Unlock if wallet update fails
    }
  };

  // Update wallet balance
  const updateWalletBalance = async (type, amount) => {
    const formData = {
      type,
      amount,
      game_type: "Wheel",
      uid: user?.uid,
      details: {
        multiplier: selectedColor?.profit,
      },
    };

    try {
      const response = await MinesGameUpdateWallet(formData);
      if (response && response.status) {
        return true;
      }
      return false;
    } catch (error) {
      if (error?.response?.status === 302) {
        toast.error(error.response.data.message, { position: "top-center" });
      } else {
        toast.error("Server Error", { position: "top-center" });
      }
      return false;
    }
  };

  // Fetch user data on mount
  useEffect(() => {
    const userDataGet = async () => {
      const response = await GetUserDetails();
      if (response && response.length > 0) {
        setTotalBalance(Number(response[0].color_wallet_balnace));
        setUser(response[0]);
      } else {
        window.location.href = "/";
      }
    };

    userDataGet();
  }, []);

  // Update colors based on game type
  useEffect(() => {
    const selectedGame = WheelData.find((item) => item.gameType === gameType);
    if (selectedGame) {
      setColors(selectedGame.colors);
    }
  }, [gameType]);

  // Sync amountRef with amount state
  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  // Update balance on win
  useEffect(() => {
    const updateBalance = async () => {
      if (isWin && selectedColor?.profit !== 0.0) {
        const winValue = amountRef.current * selectedColor?.profit;
        setTotalBalance((prev) => prev + winValue);
        await updateWalletBalance("add", winValue);
        refreshHistoryFunction();
      }
    };

    updateBalance();
  }, [selectedColor, isWin]);

  // Reset transition after disabling
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  return (
    <div>
      <ToastContainer />
      <div className="flex m-auto max-w-[421px] md:max-w-[500px] lg:max-w-5xl flex-wrap-reverse">
        <div className="w-[100%] flex flex-col-reverse lg:flex-col lg:w-[30%] p-6 h-screen/2 bg-[#213743]">
          <div className="mt-4 lg:mt-0">
            <GameTypeSelector gameStarted={gameStarted} />
          </div>
          <div className="flex flex-col-reverse lg:flex-col">
            <div>
              <div className="flex justify-between dark:text-gray-200">
                <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                  Bet Amount
                </p>
                <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                  ${Number(totalBalance).toFixed(2)}
                </p>
              </div>
              <div className="flex relative items-center">
                <input
                  className="w-full rounded border-2 border-[#2f4553] px-2 py-2 outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                  placeholder="Enter Amount"
                  type="number"
                  value={amount}
                  disabled={gameStarted || isProcessingBet}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) setAmount(value);
                  }}
                />
                <div className="absolute right-0.5">
                  <button
                    onClick={() => setAmount((prev) => Math.max(prev / 2, 0))}
                    disabled={gameStarted || isProcessingBet}
                    className="px-1.5 py-1.5 bg-gray-500 text-gray-200 text-sm font-medium"
                  >
                    1/2
                  </button>
                  <button
                    onClick={doubleTheAmount}
                    disabled={gameStarted || isProcessingBet}
                    className="px-1.5 py-1.5 bg-gray-500 text-gray-200 border-l-2 text-sm cursor-pointer font-medium border-gray-200"
                  >
                    2x
                  </button>
                </div>
              </div>
              <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                Risk
              </p>
              <select
                value={gameType}
                disabled={gameStarted || isProcessingBet}
                onChange={selectGameType}
                className="w-full rounded border-2 border-[#2f4553] px-2 py-2 outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button
              className="w-full rounded bg-[#20e701] font-semibold py-2 text-sm mt-3 disabled:opacity-50"
              onClick={handleSpinClick}
              disabled={gameStarted || isProcessingBet}
            >
              Bet
            </button>
          </div>
        </div>
        <div
          id="wheelBoard"
          className="relative w-[100%] lg:w-[70%] p-6 h-screen/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg1})` }}
        >
          <div className="flex justify-center items-center">
            <div className="relative flex flex-col items-center mt-10">
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24"
                style={{ zIndex: 5 }}
              >
                <img
                  alt="pin"
                  src={require("../../../assets/photos/pin.gif")}
                />
              </div>
              <div className="border-[20px] border-[#263742] rounded-full mt-4 shadow-lg">
                <div
                  className="relative flex justify-center items-center w-[300px] md:w-[450px] h-[300px] md:h-[450px] rounded-full"
                  style={{
                    background: `conic-gradient(${colors
                      ?.map((item, index) => {
                        const startAngle = (index * 360) / colors.length;
                        const endAngle =
                          startAngle +
                          (gameType === "low" || gameType === "medium"
                            ? 360 / colors.length
                            : (item.area * 360) / 100);
                        return `${item.color} ${startAngle}deg ${endAngle}deg`;
                      })
                      .join(", ")})`,
                    transform: `rotate(${rotation}deg)`,
                    transition: transitionEnabled
                      ? "transform 3s ease-out"
                      : "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {colors.map((item, index) => {
                    const startAngle =
                      gameType === "high"
                        ? 327.6
                        : (index * 360) / colors.length;
                    const endAngle =
                      startAngle +
                      (gameType === "low" || gameType === "medium"
                        ? 360 / colors.length
                        : (item.area * 360) / 100);
                    const midAngle = startAngle + (endAngle - startAngle) / 2;

                    return (
                      <div
                        key={index}
                        className="absolute flex items-center justify-center h-[30%] text-sm font-bold text-white"
                        style={{
                          transform: `rotate(${midAngle}deg) translate(0, -130%) rotate(-${0}deg)`,
                          transformOrigin: "center",
                          position: "absolute",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          color: item.color,
                        }}
                      >
                        {item.profit}x
                      </div>
                    );
                  })}
                  <div className="w-[85%] h-[85%] bg-[#0F212E] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 w-full m-auto mt-6">
            {colors &&
              Array.from(
                new Map(colors?.map((item) => [item.color, item])).values()
              ).map((item, index) => (
                <section
                  key={index}
                  className="relative overflow-hidden px-4 flex justify-center items-center text-[#FBFBFB] font-semibold py-3 rounded bg-[#2F4553]"
                >
                  <p
                    className="relative z-[99]"
                    style={{ textShadow: "0px 0px 4px black" }}
                  >
                    {Number(item.profit).toFixed(2)}x
                  </p>
                  <div
                    className={`absolute bottom-0 w-full rounded-b ${
                      selectedColor?.color === item.color
                        ? "h-full rounded-t animate-fade-up animate-once animate-duration-[400ms]"
                        : "h-2"
                    }`}
                    style={{ backgroundColor: item.color }}
                  ></div>
                </section>
              ))}
          </div>
          {isWin && (
            <div className="absolute w-full h-full flex justify-center items-center top-0 left-0 z-[500]">
              <div className="border-2 animate-jump border-gray-500 flex flex-col gap-2 justify-center items-center p-6 rounded-full">
                <p
                  className="font-bold text-4xl"
                  style={{ color: selectedColor?.color }}
                >
                  {selectedColor?.profit}x
                </p>
                <p
                  className={`text-lg font-bold ${
                    winAmount * selectedColor?.profit === 0
                      ? "text-red-800"
                      : "text-[#13b70a]"
                  }`}
                >
                  {winAmount * selectedColor?.profit !== 0
                    ? `+$${Number(winAmount * selectedColor?.profit).toFixed(
                        2
                      )}`
                    : `-$${Math.abs(winAmount).toFixed(2)}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
