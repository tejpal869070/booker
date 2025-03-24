import React from "react";
import {
  AllBetsData,
  BetCashoutHistory,
} from "../../../assets/Data/AviatorData";

export function AllBets() {
  return (
    <div className="mt-2">
      <section className="  p-0.5 flex justify-between rounded-md px-1 mb-0.5">
        <div className="flex   gap-1">
          <p className="text-xs font-medium text-gray-400">User</p>
        </div>
        <div className="text-xs font-medium text-gray-400 flex justify-between gap-2">
          Bet INR
        </div>
        <div className="text-xs font-medium text-gray-400">Cashout INR</div>
      </section>
      {AllBetsData.map((item, index) => (
        <section
          className={` p-0.5 flex justify-between items-center text-xs font-semibold rounded-md px-1 mb-0.5 ${
            item.isCashout
              ? "bg-[#123405] border border-green-500 text-gray-200"
              : "bg-[#101112] text-gray-400"
          }`}
        >
          <div className="flex   gap-1">
            <img
              src={require("../../../assets/photos/profile.png")}
              alt="profile"
              className="w-6"
            />
            <p className=" ">1***5</p>
          </div>
          <div className=" ">
            {Number(item.betAmount).toFixed(2)}
            {/* {item.isCashout && <p className="text-[#883cea] bg-[#091A03] px-1 rounded-md inline">{item.cashOut}</p>} */}
          </div>
          <div className="  ">{Number(item.cashoutInr).toFixed(2)}</div>
        </section>
      ))}
    </div>
  );
}

export function BetCashouts() {
  return (
    <div className=" flex flex-row gap-1">
      {BetCashoutHistory.map((item, index) => (
        <div className="px-2   rounded-full text-xs text-[#2d97d6] font-semibold bg-gray-700" key={index}>
          {Number(item.target).toFixed(2)}x
        </div>
      ))}
    </div>
  );
}
