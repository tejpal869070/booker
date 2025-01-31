import React, { useEffect, useRef, useState } from "react";
import GameTypeSelector from "./GameTypeSelector";
import { toast, ToastContainer } from "react-toastify";
import { WheelData } from "../../../assets/Data/WheelData";
import { MinesGameUpdateWallet } from "../../../Controllers/User/GamesController";
import { GetUserDetails } from "../../../Controllers/User/UserController";

export default function ManualMode() {
  const [amount, setAmount] = useState(100);
  const [totalBalance, setTotalBalance] = useState(0);
  const [gameType, setGameType] = useState("low");
  const [colors, setColors] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isWin, setWin] = useState(false);
  const [winAmount, setWinAmount] = useState(); 
    const [user, setUser] = useState({});
  
 

  const amountRef = useRef(amount);

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totalBalance) {
      setAmount(totalBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  const selectGameType = (e) => {
    setGameType(e.target.value);
  };

   

  const handleSpinFunction = (amount) => {
    const audio = new Audio(require("../../../assets/audio/spin-232536.mp3"));
    audio.play();
    setWin(false);
    setWinAmount(amount);
    setGameStarted(true);
    const newRotation = Math.floor(Math.random() * 360) + 1800;
    const totalRotation = currentRotation + newRotation;
    setRotation(-totalRotation);

    const adjustedRotation = totalRotation % 360;
    const angle = (adjustedRotation / 360) * 100;

    if (colors.length > 0) {
      if (gameType === "low" || gameType === "medium") {
        const index = Math.floor(
          (adjustedRotation % 360) / (360 / colors.length)
        );
        var landedColor = colors[index];
      } else {
        let cumulativeArea = 0;
        var landedColor = null;

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
        setWin(true);
        setTimeout(() => {
          setWin(false);
        }, 2000);
      }, 3200);
    }
  };

  const handleSpinClick = async () => {
    if (amountRef.current > totalBalance || amountRef.current === 0) {
      toast.warn("Insufficient Balance", {
        position: "top-center",
      });
      return;
    }
    handleSpinFunction(amountRef.current);
    setTotalBalance((pre) => pre - amountRef.current);
    updateWalletBalance("deduct", amountRef.current);
  };

  // update wallet balance online---------------------------------------------
  const formData = {};
  const updateWalletBalance = async (type, amount) => {
    formData.type = type;
    formData.amount = amount;
    formData.game_type = "Wheel";
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
    }
  };

  useEffect(() => {
    const userDataGet = async () => {
      const response = await GetUserDetails();
      if (response !== null) {
        setTotalBalance(Number(response[0].color_wallet_balnace));
        setUser(response[0])
      } else {
        window.location.href = "/";
      }
    };

    userDataGet();
  }, []);

  useEffect(() => {
    setColors(WheelData.find((item) => item.gameType === gameType).colors);
  }, [gameType]);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

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
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);
 

  return (
    <div>
      <div className="flex flex-wrap-reverse">
        <div className="w-[100%] md:w-[35%] lg:w-[25%] p-6 h-screen/2 bg-gray-500">
          <GameTypeSelector gameStarted={gameStarted} />
          <div>
            <ToastContainer />
            <div>
              <div className="flex justify-between dark:text-gray-200">
                <p className="lg:text-sm font-medium">Bet Amount</p>
                <p>₹{Number(totalBalance).toFixed(2)}</p>
              </div>
              <div className="flex relative items-center">
                <input
                  className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
                  placeholder="Enter Amount "
                  type="number"
                  value={amount}
                  disabled={gameStarted}
                  onChange={(e) => setAmount(Number(e.target.value))} // Convert to number
                />
                <div className="absolute right-0.5   ">
                  <button
                    onClick={() => setAmount((pre) => pre / 2)}
                    disabled={gameStarted}
                    className="px-1.5  py-1.5 bg-gray-500 text-gray-200   text-sm  font-medium  "
                  >
                    1/2
                  </button>
                  <button
                    onClick={() => doubleTheAmount()}
                    disabled={gameStarted}
                    className="px-1.5  py-1.5 bg-gray-500 text-gray-200 border-l-2 text-sm  font-medium border-gray-200"
                  >
                    2x
                  </button>
                </div>
              </div>
              <p className="lg:text-sm font-medium  dark:text-gray-200 mt-3">
                Risk
              </p>
              <select
                value={gameType}
                disabled={gameStarted}
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
              disabled={gameStarted}
            >
              Bet
            </button>
          </div>
        </div>
        <div
          id="wheelBoard"
          className=" relative w-[100%] md:w-[65%] lg:w-[75%] p-6 h-screen/2 bg-[#0F212E]"
        >
          <div className="flex justify-center items-center">
            <div className="relative flex flex-col items-center mt-10">
              {/* Pin */}
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24"
                style={{ zIndex: 10 }}
              >
                <img
                  alt="pin"
                  src={require("../../../assets/photos/pin.gif")}
                />
              </div>
              <div className="border-[20px] border-[#263742] rounded-full mt-4">
                <div
                  className={`relative flex justify-center items-center w-[300px] md:w-[450px] h-[300px] md:h-[450px]  rounded-full`}
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
                  }}
                >
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
                    className="relative z-[99] "
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
                    style={{ backgroundColor: `${item.color}` }}
                  ></div>
                </section>
              ))}
          </div>

          {isWin && (
            <div className="absolute w-full h-full flex justify-center items-center top-0 left-0 z-[500]">
              <div className="border-2 animate-jump border-gray-500 flex flex-col gap-2 justify-center items-center p-6 rounded-full">
                <p
                  className="font-bold text-4xl  "
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
                    ? `+₹${Number(winAmount * selectedColor?.profit).toFixed(
                        2
                      )}`
                    : `-₹${Math.abs(winAmount).toFixed(2)}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
