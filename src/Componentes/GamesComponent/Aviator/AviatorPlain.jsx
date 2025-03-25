import React, { useEffect, useState } from "react";
import bg1 from "../../../assets/photos/aviator-bg-2.png";
import { motion, useMotionValue } from "framer-motion";
import aviator from "../../../assets/photos/aviator.gif";
import CountUp from "react-countup";
import ProgressBar from "@ramonak/react-progress-bar";

export default function AviatorPlain() {
  const [amount, setAmount] = useState(10);
  const [isFlying, setFlying] = useState(false);
  const [isGameStarting, setGameStarting] = useState(true);

  const [planeX, setPlaneX] = useState(50);
  const [planeY, setPlaneY] = useState(500);

  // Motion values for real-time tracking
  const x = useMotionValue(50);
  const y = useMotionValue(500);

  // Update state when motion values change
  useEffect(() => {
    x.onChange((latest) => setPlaneX(latest));
    y.onChange((latest) => setPlaneY(latest));
  }, [x, y]);

  useEffect(() => {
    let intervalId = setInterval(() => {
      setFlying(true);
      setGameStarting(false);
    }, 11000);

    let intervalId2 = setInterval(() => {
      setFlying(false);
      setGameStarting(true);
    }, 22000);

    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
    };
  }, []);

  return (
    <div>
      <div className="relative border-[1px] border-gray-700 w-full  rounded-md mt-2 min-h-[60vh]  max-h-[60vh] overflow-hidden">
        <div className="absolute w-full h-full  ">
          <img
            src={bg1}
            alt="poster"
            className={`max-w-none absolute w-[200vw] -left-[184%] -top-[205%] ${
              isFlying && "animate-[spin_25s_linear_infinite]"
            } `}
          />
        </div>
        <div className="absolute -bottom-20 -left-20 w-[12vw]  h-[12vw] backdrop-blur-md  rounded-full "></div>
        <div className="absolute  top-0 left-0 w-full h-full flex justify-center items-center">
          {isGameStarting ? (
            <div className=" backdrop-blur-[1px] rounded w-[40%] h-[35%]   flex justify-center items-center">
              <p className="text-4xl font-bold text-gray-100">
                <p>SneakBooker</p>
                <ProgressBar
                  maxCompleted={100}
                  dir="rtl"
                  completed={100}
                  height="10px"
                  className="mt-4"
                  baseBgColor="red"
                  bgColor="white"
                  animateOnRender={true}
                  customLabel=" "
                  transitionDuration="10s"
                />
              </p>
            </div>
          ) : (
            <div className="   w-[40%] h-[35%] rounded-full flex justify-center items-center">
              <p
                className="text-7xl font-bold text-gray-100"
                style={{ textShadow: "0px 0px 100px rgba(47,118,210,1)" }}
              >
                <CountUp end={15.3} decimals={2} duration={15.3} />x
              </p>
            </div>
          )}
        </div>

        {/* plain */}
        {isFlying ? (
          <div>
            <svg className="absolute -top-2 left-0 w-full h-full">
              <motion.path
                d={`M 50,500 
              Q ${(planeX + 50) / 2},${(planeY + 500) / 2 + 50} 
              ${planeX},${planeY} 
              L ${planeX},500 Z`}
                fill="rgba(255, 0, 0, 0.5)" // Semi-transparent red
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </svg>

            {/* Plane Animation */}
            <motion.div
              style={{ x, y }}
              initial={{ x: 50, y: 500, rotate: 15 }}
              animate={{ x: 700, y: 100, rotate: 10 }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="absolute"
            >
              <img src={aviator} alt="Plane" className="-ml-10 -mt-8" width={128} height={128} />
            </motion.div>
          </div>
        ) : (
          <img
            src={aviator}
            alt="Plane"
            className="absolute bottom-0 left-0"
            style={{ rotate: "15deg" }}
            width={128}
            height={128}
          />
        )}
      </div>

      {/* pricing tag */}
      <div className="border-[1px] border-gray-700 rounded-md mt-3 p-4 bg-[#1b1c1d] flex flex-row rounded-md justify-center gap-4">
        <div>
          <div className="flex  justify-between items-center bg-[#080809] inline p-2 rounded-full">
            <button
              onClick={() => setAmount((pre) => pre - 1)}
              disabled={amount === 1}
              className="rounded-full border-2 border-gray-400 text-gray-200 font-semibold text-lg  w-8 h-6 flex items-center justify-center"
            >
              -
            </button>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#080809] text-gray-200 focus:outline-none text-center w-full"
            />
            <button
              onClick={() => setAmount((pre) => pre + 1)}
              className="rounded-full border-2 border-gray-400 text-gray-200 font-semibold text-lg  w-8 h-6 flex items-center justify-center"
            >
              +
            </button>
          </div>
          <div className="flex gap-2 p-1">
            {pricing.map((item, index) => (
              <div
                key={index}
                className=""
                onClick={() => setAmount(item.price)}
              >
                <img
                  alt="price"
                  src={item.image}
                  className="w-10 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          className={`w-40 rounded-3xl border-2 text-gray-100 py-2 text-xl font-semibold border-gray-200 ${
            amount < 1 ? "bg-gray-400" : "bg-[#28a909]"
          }`}
          disabled={amount < 1}
        >
          BET<p>₹{Number(amount).toFixed(2)}</p>
        </button>
      </div>
    </div>
  );
}

const pricing = [
  {
    id: 1,
    price: 10,
    image: require("../../../assets/photos/78.png"),
  },
  {
    id: 2,
    price: 20,
    image: require("../../../assets/photos/79.png"),
  },
  {
    id: 1,
    price: 50,
    image: require("../../../assets/photos/80.png"),
  },
  {
    id: 1,
    price: 100,
    image: require("../../../assets/photos/81.png"),
  },
  {
    id: 1,
    price: 500,
    image: require("../../../assets/photos/82.png"),
  },
  {
    id: 1,
    price: 1000,
    image: require("../../../assets/photos/83.png"),
  },
];
