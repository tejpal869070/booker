import React, { useEffect, useState } from "react";
import { HiMiniWallet } from "react-icons/hi2";
import { MdGeneratingTokens } from "react-icons/md";
import SocialShare from "../Account/SocialShare";
import { Link } from "react-router-dom";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { Loading1 } from "../Loading1";
import { GiReceiveMoney } from "react-icons/gi";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { FcConferenceCall } from "react-icons/fc";
import { FcAreaChart } from "react-icons/fc";
import { FcMoneyTransfer } from "react-icons/fc";
import { BiSolidColor } from "react-icons/bi";
import { PiFootballFill } from "react-icons/pi";
import bg1 from "../../assets/photos/bg-main.jpg";

export default function Hero1() {
  const [showShare, setShowShare] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const openSocialShare = () => {
    setShowShare(true);
  };

  const closeSocialShare = () => {
    setShowShare(false);
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUserData(response[0]);
      localStorage.setItem("userDetails", JSON.stringify(response[0]));
      setLoading(false);
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 bg-[#1c1c1cc4] z-[99999]  w-screen h-screen flex items-center justify-center m-auto inset-0">
        <Loading1 />
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="grid grid-cols-12 gap-4 w-full">
        <div
          className="relative col-span-12 md:col-span-8 bg-opacity-10 bg-top bg-cover bg-left-bottom border-2 border-[#92a0fd] dark:border-gray-200 rounded-lg flex justify-between p-4"
          style={{ backgroundImage: `url(${bg1})` }}
        >
          

          <div className="z-[9]">
            <h1
              className="text-xl font-bold  text-white " 
            >
              Congratulations {userData && userData.uname}! 🎉
            </h1>
            <p className="text-sm mt-2 text-gray-100">
              Joining: {userData && userData?.date?.split("T")[0]}
            </p>
            <div className="flex flex-wrap   gap-4 mt-4">
              <div
                className="relative cursor-pointer"
                onClick={openSocialShare}
              >
                <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black "></span>
                <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                  Referral
                </span>
              </div>
              <Link
                className="relative"
                to={{
                  pathname: "/home",
                  search: "?money=usdt-deposit",
                }}
              >
                <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                  Deposit
                </span>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-100 z-1" />
        </div>

        <div className="col-span-12 md:col-span-4     w-full   rounded-lg">
          <div className="grid grid-cols-12 gap-4 w-full">
            <div className=" col-span-6 rounded-lg shadow-[2px_2px_3px_4px_#bee3f8] p-4">
              <HiMiniWallet size={24} color="#92a0fd" />
              <p className="font-bold dark:text-gray-300">Total Balance</p>
              <p className="text-2xl font-bold text-black dark:text-gray-300">
                ₹{userData.wallet_balance}
              </p>
            </div>

            <div className=" col-span-6 rounded-lg shadow-[2px_2px_3px_4px_#bee3f8] p-4">
              <MdGeneratingTokens size={26} color="#92a0fd" />
              <p className="font-bold dark:text-gray-300">
                {userData.currency} Value
              </p>
              <p className="text-2xl font-bold text-black dark:text-gray-300">
                {(
                  userData.wallet_balance / Number(userData.currency_rate)
                ).toFixed(2)}
              </p>
            </div>

            <div className="col-span-12 md:col-span-6 xl:col-span-12  bg-gradient-to-r from-indigo-400 to-cyan-400 py-2 rounded-lg px-4">
              <p className="font-bold text-white">
                {userData.currency} Rate : ₹{userData.currency_rate}/COIN
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* quick options */}
      <p className="text-2xl pt-10 pb-4 dark:text-gray-200 font-bold ">
        Qucik Action
      </p>
      <div className="flex flex-wrap gap-4 pb-4 ">
        {linkData.map(({ to, icon, label }, index) => (
          <Link key={index} className="relative cursor-pointer" to={to}>
            <div className="overflow-hidden w-24 md:w-32 text-white bg-black dark:bg-gray-700 rounded group">
              <p className="px-3.5 py-2 text-white bg-[#919ffdfc] group-hover:[#7b9eff] flex items-center justify-center transition-transform duration-300 group-hover:translate-y-[-5px]">
                {icon}
              </p>
              <p className="  py-1 text-gray-200 text-center">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {showShare && (
        <SocialShare
          url={`${window.location.origin}/register?referrer_code=${userData.reffer_code}`}
          onClose={closeSocialShare}
        />
      )}
    </div>
  );
}

const linkData = [
  {
    to: { pathname: "/home", search: "?game=color-game" },
    icon: <BiSolidColor size={30} color="#fcff21" />,
    label: "Color Game",
  },
  {
    to: { pathname: "/home", search: "?event=inplay" },
    icon: <PiFootballFill size={30} />,
    label: "Inplay",
  },
  {
    to: { pathname: "/home", search: "?money=usdt-deposit" },
    icon: <GiReceiveMoney size={30} />,
    label: "Deposit",
  },
  {
    to: { pathname: "/home", search: "?money=withdrawal" },
    icon: <FcMoneyTransfer size={30} />,
    label: "Withdraw",
  },
  {
    to: { pathname: "/home", search: "?account=account-history" },
    icon: <HiClipboardDocumentList size={30} />,
    label: "History",
  },
  {
    to: { pathname: "/home", search: "?network=downline-member" },
    icon: <FcConferenceCall size={30} />,
    label: "My Team",
  },
  {
    to: { pathname: "/home", search: "?investment=new-investment" },
    icon: <FcAreaChart size={30} />,
    label: "Investment",
  },
];
