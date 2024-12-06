import React, { useEffect, useRef, useState } from "react";
import ManualMode from "../GamesComponent/WheelGame/ManualMode";
import { WheelData } from "../../assets/Data/WheelData";
import AutoMode from "../GamesComponent/WheelGame/AutoMode";
import { toast, ToastContainer } from "react-toastify";

const WheelGame = () => {
  const [selected, setSelected] = useState("Manual");
  const [colors, setColors] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [winAmount, setWinAmount] = useState(0);
  const [isWin, setWin] = useState(false);
  const [gameType, setGameType] = useState("low");
  const timeoutRef = useRef([]);
  const currentRotationRef = useRef(currentRotation);
  const [isAutoBetStart, setAutoBetStart] = useState();

  const handleClick = (type) => {
    setSelected(type);
  };

  const handleSpinFunction = (amount) => {
    const audio = new Audio(require("../../assets/audio/spin-232536.mp3"));
    audio.play();
    setWin(false);
    setWinAmount(amount);
    setGameStarted(true);
    const newRotation = Math.floor(Math.random() * 360) + 1800;
    const totalRotation = currentRotationRef.current + newRotation;
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

  useEffect(() => {
    currentRotationRef.current = currentRotation;
  }, [currentRotation]);

  const handleSpin = (amount, stopProfit, stopLoss, balanceRef, totalBets) => {
    if (selected === "Manual") {
      handleSpinFunction(amount);
    } else {
      let currentBet = 0;

      const startBetting = () => {
        setAutoBetStart(true);
        if (stopProfit > 0 || stopLoss > 0 || totalBets == 0) {
          const infiniteBetting = () => {
            currentBet++;
            handleSpinFunction(amount);
            timeoutRef.current.push(setTimeout(infiniteBetting, 3500));
          };
          infiniteBetting();
        } else {
          const startRegularBetting = () => {
            if (balanceRef < amount) {
              stopAutoBet();
              toast.warn("Insufficient funds");
              return;
            }
            if (currentBet < totalBets) {
              handleSpinFunction(amount);
              currentBet++;
              timeoutRef.current.push(setTimeout(startRegularBetting, 3500));
            } else {
              stopAutoBet();
            }
          };
          startRegularBetting();
        }
      };

      startBetting();
    }
  };

  const handleReset = () => {
    setTransitionEnabled(false);
    setRotation(0);
    setSelectedColor(null);
    setWin(false);
    setWinAmount(0);
  };

  const stopAutoBet = () => {
    timeoutRef.current.forEach((id) => clearTimeout(id));
    setAutoBetStart(false);
  };

  const handleGameType = (type) => {
    setGameType(type);
  };

  useEffect(() => {
    setColors(WheelData.find((item) => item.gameType === gameType).colors);
  }, [gameType]);

  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  return (
    <div className="min-h-screen ">
      <ToastContainer />
      <div className="flex flex-wrap-reverse">
        <div className="w-[100%] md:w-[35%] lg:w-[25%] p-6 h-screen/2 bg-gray-500">
          <div className="w-full flex space-x-2 bg-gray-800 rounded-full px-2 py-3">
            <button
              onClick={() => handleClick("Manual")}
              disabled={isAutoBetStart}
              className={`relative w-1/2 px-6 py-2 rounded-full overflow-hidden  font-medium   transition-all  ${
                selected === "Manual"
                  ? "bg-blue-500 text-gray-100"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              <span
                className={`absolute rounded-lg inset-0 z-[-1] bg-blue-500 transition-all duration-300 ease-in-out 
                ${
                  selected === "Manual"
                    ? "transform scale-x-100"
                    : "transform scale-x-0"
                } origin-right`}
              />
              Manual
            </button>

            <button
              onClick={() => handleClick("Auto")}
              disabled={isAutoBetStart}
              className={`relative w-1/2 px-6 py-2 rounded-full overflow-hidden  font-medium transition-all  ${
                selected === "Auto"
                  ? "bg-blue-500 text-gray-100"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              <span
                className={`absolute rounded-lg inset-0 z-[-1] bg-blue-500 transition-all duration-300 ease-in-out 
                ${
                  selected === "Auto"
                    ? "transform scale-x-100"
                    : "transform scale-x-0"
                } origin-left`}
              />
              Auto
            </button>
          </div>
          {selected === "Manual" ? (
            <ManualMode
              gameStarted={gameStarted}
              handleSpin={(amount) => handleSpin(amount)}
              handleReset={handleReset}
              selectedColor={selectedColor}
              isWin={isWin}
              handleGameType={(type) => handleGameType(type)}
            />
          ) : (
            <AutoMode
              stopAutoBet={() => stopAutoBet()}
              selectedColor={selectedColor}
              isWin={isWin}
              handleSpin={(
                amount,
                stopProfit,
                stopLoss,
                balanceRef,
                totalBets
              ) =>
                handleSpin(amount, stopProfit, stopLoss, balanceRef, totalBets)
              }
            />
          )}
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
                <img alt="pin" src={require("../../assets/photos/pin.gif")} />
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
                <p className="font-bold text-4xl text-[#406C82]">
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
};

export default WheelGame;
