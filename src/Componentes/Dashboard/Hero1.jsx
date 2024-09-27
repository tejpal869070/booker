import React, { useEffect, useState } from "react";
import { HiMiniWallet } from "react-icons/hi2";
import { MdGeneratingTokens } from "react-icons/md";
import SocialShare from "../Account/SocialShare";
import { Link } from "react-router-dom";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { Loading1 } from "../Loading1";

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
        <div className="col-span-12 md:col-span-8   border-2  border-[#92a0fd] dark:border-gray-200 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-gray-400 dark:[background-size:0px_0px]   rounded-lg flex justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-black">
              Congratulations {userData && userData.uname}! 🎉
            </h1>
            <p className="text-sm mt-2 text-black">
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
          <div></div>
        </div>

        <div className="col-span-12 md:col-span-4   h-60 w-full   rounded-lg">
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
      {showShare && (
        <SocialShare
          url={`${window.location.origin}/register?referrer_code=`}
          onClose={closeSocialShare}
        />
      )}
    </div>
  );
}
