import React, { useState } from "react";
import AccountHistory from "./Accounthistory";
import DepositHistory from "../Money/MoneyIn/DepositHistory";
import WithdrawalHistory from "../Money/MoneyOut/WithdrawalHistory";
import TodayHistory from "./TodayHistory";
import GameWalletHistory from "./GameWalletHistory";
import RoiIncome from "../Income/RoiIncome";
import LevelIncome from "../Income/LevelIncome";
import ReferIncome from "../Income/ReferIncome";
import MatchingIncome from "../Income/MatchingIncome";
import InvestmentHistory from "../Investment/InvestmentHistory";

export default function AllHistory() {
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <section className="flex overflow-scroll mt-4 gap-2 mb-2">
        {links.slice(0,4).map((item, index) => (
          <div
            key={index}
            title="tabs"
            onClick={() => setSelected(index)}
            className={`px-4 py-2  text-gray-200 whitespace-nowrap ${
              selected === index
                ? "bg-gradient-to-l from-orange-400 to-yellow-500 text-gray-800 font-semibold rounded-t-[10px]"
                : "border-[0.5px] rounded-t-[10px]"
            }`}
          >
            {item.title}
          </div>
        ))}
      </section>
      <section className="flex overflow-scroll mt-4 gap-2 mb-2">
        {links.slice(4,9).map((item, index) => (
          <div
            key={index}
            title="tabs"
            onClick={() => setSelected(index+4)}
            className={`px-4 py-2  text-gray-200 whitespace-nowrap ${
              selected === index+4
                ? "bg-gradient-to-l from-orange-400 to-yellow-500 text-gray-800 font-semibold rounded-t-[10px]"
                : "border-[0.5px] rounded-t-[10px]"
            }`}
          >
            {item.title}
          </div>
        ))}
      </section>

      {selected === 0 ? (
        <AccountHistory />
      ) : selected === 1 ? (
        <DepositHistory />
      ) : selected === 2 ? (
        <WithdrawalHistory />
      ) : selected === 3 ? (
        <TodayHistory />
      ) : selected === 4 ? (
        <GameWalletHistory />
      ) : selected === 5 ? (
        <RoiIncome />
      ) : selected === 6 ? (
        <LevelIncome />
      ) : selected === 7 ? (
        <ReferIncome />
      ) : selected === 8 ? (
        <MatchingIncome />
      ) : selected === 9 ? (
        <InvestmentHistory />
      ) : (
        ""
      )}
    </div>
  );
}

const links = [
  { id: 1, title: "Account History" },
  { id: 2, title: "Deposit" },
  { id: 3, title: "Withdrawal" },
  { id: 4, title: "Today" },
  { id: 5, title: "Game Wallet" },
  { id: 5, title: "ROI Income" },
  { id: 6, title: "Level Income" },
  { id: 7, title: "Refer Income" },
  { id: 8, title: "Matching Income" },
  { id: 9, title: "Investment History" },
];
