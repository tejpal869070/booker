import React, { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsWalletFill } from "react-icons/bs";
import { RiUserSharedFill } from "react-icons/ri";
import { TbMoneybag } from "react-icons/tb";
import { TiDocumentText } from "react-icons/ti";
import { GrDocumentText } from "react-icons/gr";
import { FaHistory } from "react-icons/fa";
import { Loading1 } from "../Loading1";
import { GetUserDetails } from "../../Controllers/User/UserController";

export default function Wallet() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = useState(true);

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setLoading(false);
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center m-auto inset-0">
        <Loading1 />
      </div>
    );
  }


  return (
    <div className=" h-screen">
      <div className="m-2 border-2 rounded-lg dark:bg-gray-700  ">
        <p className="text-center text-3xl font-bold text-[#8F9DFA] border-b-2 border-indigo-400 py-2">
          Wallet
        </p>
        <p className="text-2xl font-bold text-center mt-6 dark:text-gray-200 ">
          ₹
          {user &&
            Number(user.wallet_balance) + Number(user.color_wallet_balnace)}
        </p>
        <p className="text-center text-sm  text-gray-400 -mt-1">
          Total Balance
        </p>

        <div className="flex justify-between w-full px-4 mt-6">
          <div className="flex w-[45%] flex-col justify-center items-center rounded-lg  p-4 px-6  bg-gradient-to-r from-red-400 to-red-300">
            <p className="font-semibold text-2xl text-white">
              ₹{user && user.wallet_balance}
            </p>
            <p className="text-sm text-gray-200">Main Wallet</p>
          </div>
          <div className="flex w-[45%] flex-col justify-center items-center rounded-lg  p-4 px-6  bg-gradient-to-r from-red-400 to-red-300">
            <p className="font-semibold text-2xl text-white">
              ₹{user && user.color_wallet_balnace}
            </p>
            <p className="text-sm text-gray-200">Game Wallet</p>
          </div>
        </div>

        <div className="flex flex-wrap   mt-6">
          {links.map((item, index) => (
            <Link
              key={index}
              to={item.linkTo}
              className="w-1/4  backdrop-blur-sm flex flex-col gap-1  p-2 pt-2 rounded-lg flex   items-center   "
            >
              <p className="p-2 dark:bg-gray-500 rounded-lg shadow-lg">
                {item.icons}
              </p>
              <p className=" text-sm text-gray-500 dark:text-gray-200 text-center">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const links = [
  {
    label: "Deposit",
    icons: <FaWallet size={26} className="dark:text-white" />,
    linkTo: "/home?money=usdt-deposit",
  },
  {
    label: "Withdraw",
    icons: <BsWalletFill size={26} className="dark:text-white" />,
    linkTo: "/home?money=withdrawal",
  },
  {
    label: "Deposit Hitory",
    icons: <FaWallet size={26} className="dark:text-white" />,
    linkTo: "/home?money=deposit-history",
  },
  {
    label: "Withdraw History",
    icons: <BsWalletFill size={26} className="dark:text-white" />,
    linkTo: "/home?money=withdrawal-history",
  },

  {
    label: "Investment",
    icons: <TbMoneybag fill="white" size={26} className="dark:text-white" />,
    linkTo: "/home?investment=new-investment",
  },
  {
    label: "Investment History",
    icons: <TiDocumentText size={26} className="dark:text-white" />,
    linkTo: "/home?investment=investment-history",
  },
  {
    label: "Send Money",
    icons: <RiUserSharedFill size={26} className="dark:text-white" />,
    linkTo: "/home?account=send-money",
  },
  {
    label: "Today History",
    icons: <GrDocumentText size={26} className="dark:text-white" />,
    linkTo: "/home?account=today-history",
  },
  {
    label: "Account History",
    icons: <FaHistory size={26} className="dark:text-white" />,
    linkTo: "/home?account=account-history",
  },
];
