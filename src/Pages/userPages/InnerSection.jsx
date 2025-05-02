import React from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "../../Componentes/Dashboard/Dashboard";
import Downlinemember from "../../Componentes/Network/Downlinemember";
import DirextDownline from "../../Componentes/Network/DirectDownline";
import AddNewMember from "../../Componentes/Network/AddNewMember";
import MemberTree from "../../Componentes/Network/MemberTree";
import BankDeposit from "../../Componentes/Money/MoneyIn/BankDeposit";
import DepositHistory from "../../Componentes/Money/MoneyIn/DepositHistory";
import Withdrawal from "../../Componentes/Money/MoneyOut/Withdrawal";
import WithdrawalHistory from "../../Componentes/Money/MoneyOut/WithdrawalHistory";
import SendMoney from "../../Componentes/Account/SendMoney";
import TodayHistory from "../../Componentes/Account/TodayHistory";
import AccountHistory from "../../Componentes/Account/Accounthistory";
import NewInvestment from "../../Componentes/Investment/NewInvestment";
import InvestmentHistory from "../../Componentes/Investment/InvestmentHistory";
import MatchingIncome from "../../Componentes/Income/MatchingIncome";
import ReferIncome from "../../Componentes/Income/ReferIncome";
import RoiIncome from "../../Componentes/Income/RoiIncome";
import Inplay from "../../Componentes/Events/Inplay";
import Events from "../../Componentes/Events/Events";
import ColorGameTime from "../../Componentes/Casino/ColorGameTime";
import ChangePin from "../../Componentes/Account/ChangePin";
import UserProfile from "../../Componentes/Account/UserProfile";
import Wallet from "../../Componentes/Account/Wallet";
import VIP from "../../Componentes/Account/VIP";
import GameWalletHistory from "../../Componentes/Account/GameWalletHistory";
import LevelIncome from "../../Componentes/Income/LevelIncome";
import LiveCasino from "../LiveCasino";
import Refer from "../../Componentes/Account/Refer";
import InvestmentPage from "../../Componentes/Account/InvestmentPage";
import CryptoWithdrawal from "../../Componentes/Money/MoneyOut/WithdrawalOption/CryptoWithdrawal";

export default function InnerSection() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // get path and query to display content in inner section
  const paramsData = {};
  for (const [key, value] of queryParams.entries()) {
    paramsData[key] = value;
  }

  if (paramsData && paramsData.event === "inplay") {
    return <div className="max-w-7xl">{<Inplay />}</div>;
  } else if (paramsData && paramsData.event === "cricket") {
    return <div className="max-w-7xl"> {<Events gameType="cricket" />} </div>;
  } else if (paramsData && paramsData.event === "football") {
    return <div className="max-w-7xl">{<Events gameType="football" />}</div>;
  } else if (paramsData && paramsData.event === "tennis") {
    return <div className="max-w-7xl">{<Events gameType="tennis" />}</div>;
  } else if (paramsData && paramsData.investment === "new-investment") {
    return <div className="max-w-7xl"> {<NewInvestment />} </div>;
  } else if (paramsData && paramsData.user === "profile") {
    return <div className="max-w-7xl"> {<UserProfile />} </div>;
  } else if (paramsData && paramsData.user === "wallet") {
    return <div className="max-w-7xl"> {<Wallet />} </div>;
  } else if (paramsData && paramsData.user === "VIP") {
    return <div className="max-w-7xl"> {<VIP />} </div>;
  } else if (paramsData && paramsData.user === "refer") {
    return <div className="max-w-7xl"> {<Refer />} </div>;
  } else if (paramsData && paramsData.user === "investment") {
    return <div className="max-w-7xl"> {<InvestmentPage />} </div>;
  } else if (paramsData && paramsData.investment === "investment-history") {
    return <div className="max-w-7xl"> {<InvestmentHistory />} </div>;
  } else if (paramsData && paramsData.network === "downline-member") {
    return <div className="max-w-7xl">{<Downlinemember />}</div>;
  } else if (paramsData && paramsData.network === "direct-downline") {
    return <div className="max-w-7xl">{<DirextDownline />}</div>;
  } else if (paramsData && paramsData.network === "add-new-member") {
    return <div className="max-w-7xl">{<AddNewMember />}</div>;
  } else if (paramsData && paramsData.network === "member-tree") {
    return <div className="max-w-7xl">{<MemberTree />}</div>;
  } else if (paramsData && paramsData.money === "usdt-deposit") {
    return <div className="max-w-7xl"> {<BankDeposit />} </div>;
  } else if (paramsData && paramsData.money === "deposit-history") {
    return <div className="max-w-7xl"> {<DepositHistory />} </div>;
  } else if (paramsData && paramsData.money === "withdrawal") {
    return <div className="max-w-7xl">{<CryptoWithdrawal />}</div>;
  } else if (paramsData && paramsData.money === "withdrawal-history") {
    return <div className="max-w-7xl"> {<WithdrawalHistory />} </div>;
  } else if (paramsData && paramsData.account === "send-money") {
    return <div className="max-w-7xl"> {<SendMoney />} </div>;
  } else if (paramsData && paramsData.account === "today-history") {
    return <div className="max-w-7xl"> {<TodayHistory />} </div>;
  } else if (paramsData && paramsData.account === "account-history") {
    return <div className="max-w-7xl"> {<AccountHistory />} </div>;
  } else if (paramsData && paramsData.account === "game-wallet-history") {
    return <div className="max-w-7xl"> {<GameWalletHistory />} </div>;
  } else if (paramsData && paramsData.income === "matching-income") {
    return <div className="max-w-7xl"> {<MatchingIncome />} </div>;
  } else if (paramsData && paramsData.income === "refferer-income") {
    return <div className="max-w-7xl"> {<ReferIncome />} </div>;
  } else if (paramsData && paramsData.income === "level-income") {
    return <div className="max-w-7xl"> {<LevelIncome />} </div>;
  } else if (paramsData && paramsData.income === "roi-income") {
    return <div className="max-w-7xl"> {<RoiIncome />} </div>;
  } else if (paramsData && paramsData.change === "securityPin") {
    return <div className="max-w-7xl"> {<ChangePin />} </div>;
  } else if (paramsData && paramsData.colorGameType) {
    return <div className="max-w-7xl"> {<ColorGameTime gameType={paramsData.colorGameType} />} </div>;
  } else if (paramsData && paramsData.game !== undefined) {
    return <div className="max-w-7xl"> {<LiveCasino />} </div>;
  } else {
    return <div>{<Dashboard />}</div>;
  }
}
