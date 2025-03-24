import React, { useState } from "react";
import bg1 from "../../../assets/photos/aviator-bg-1.webp";
import { motion } from "framer-motion";
import aviator from "../../../assets/photos/aviatorPng.png";
import CountUp from "react-countup";

export default function AviatorPlain() {
  const [amount, setAmount] = useState(10);
  const [isFlying, setFlying]  = useState(false);
  return (
    <div>
      <div className="relative border-[1px] border-gray-700 w-full  rounded-md mt-2 min-h-[60vh]  max-h-[60vh] overflow-hidden">
        <div className="absolute w-full h-full  ">
          <img
            src={bg1}
            alt="poster"
            className="max-w-none absolute w-[200vw] -left-[184%] -top-[205%] animate-[spin_25s_linear_infinite]  "
          />
        </div>
        <div className="absolute -bottom-20 -left-20 w-[12vw]  h-[12vw] backdrop-blur-md  rounded-full "></div>
        <div className="absolute  top-0 left-0 w-full h-full flex justify-center items-center">
          <div
            className="bg-[#3559a973]  w-[40%] h-[35%] rounded-full flex justify-center items-center"
            style={{ boxShadow: "1px 0px 97px #375eb5" }}
          >
            <p className="text-7xl font-bold text-gray-100">
              <CountUp end={100} />
            </p>
          </div>
        </div>

        {/* plain */}
        <motion.div
          initial={{ width: 0, height: 1, x: 0, y: 200, opacity: 1 }}
          animate={{ width: 600, height: 50, x: 0, y: -100, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          className="absolute top-40 left-0   "
        />

        {/* Animated Plane */}
        <motion.div
          initial={{ x: 0, y: 200, rotate: 15 }}
          animate={{ x: 600, y: -100, rotate: 10 }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          className="absolute top-40 left-0"
        >
          <img src={aviator} alt="Plane" width={128} height={128} />
        </motion.div>
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
