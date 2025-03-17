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
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import VerifyPin from "../VerifyPin";
import { ToastContainer, toast } from "react-toastify";
import { MainGameWalletMoneyTransfer } from "../../Controllers/User/GamesController";
import { IoGameController } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { PiUserListFill } from "react-icons/pi";
import { BsFillSafeFill } from "react-icons/bs";
import { FaCircleChevronRight } from "react-icons/fa6";

export default function Wallet() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState();
  const [amountHave, setAmountHave] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [transferToAmount, setTransferToAmount] = useState();
  const [isVerifyOpen, setVerifyOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setLoading(false);
    }
  };

  const handleButtons = (id) => {
    setIsOpen(true);
    setType(id);
    if (id === 1) {
      setAmountHave(user.wallet_balance);
    } else {
      setAmountHave(user.color_wallet_balnace);
    }
  };

  const openVerifyPin = () => {
    if (transferToAmount > Number(amountHave)) {
      toast.error("Amount Exceed", {
        position: "top-center",
      });
    } else if (transferToAmount < 100 || transferToAmount === undefined) {
      toast.error("Minimum Amount is 100", {
        position: "top-center",
      });
    } else {
      setVerifyOpen(true);
    }
  };

  const onclose2 = () => {
    setVerifyOpen(false);
  };

  const formData = {
    amount: transferToAmount,
    type: type,
  };

  const successFunction = async (pin) => {
    try {
      const response = await MainGameWalletMoneyTransfer(formData, pin);
      if (response.status) {
        setSuccess(true);
        userDataGet();
        setTransferToAmount(0);
        setIsOpen(false);
        setTimeout(() => {
          setSuccess(false);
        }, 3500);
      } else {
        toast.error(`Please Try Again !`, {
          position: "top-center",
        });
      }
    } catch (error) {
      if (error.response.status === 302) {
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
        });
      } else {
        toast.error(`Something Went Wrong !`, {
          position: "top-center",
        });
      }
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center m-auto inset-0">
        <Loading1 />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <div className=" h-screen">
        <div className="m-2 border-2 rounded-lg dark:bg-gray-700  ">
          <p className="text-center text-xl font-bold text-[#8F9DFA]  py-2">
            Wallet
          </p>
          <img
            alt="wallet icon"
            src={require("../../assets/photos/walleticon.png")}
            className="m-auto w-16 h-16"
          />
          <p className="text-2xl font-bold text-center mt-2 dark:text-gray-200 ">
            ₹
            {user &&
              (
                Number(user.wallet_balance) + Number(user.color_wallet_balnace)
              ).toFixed(2)}
          </p>
          <p className="text-center text-sm  text-gray-400 -mt-1 pb-4 border-b-2 border-indigo-400">
            Total Balance
          </p>

          <div className="flex justify-between w-full px-2 mt-6">
            <div className="flex w-[45%] flex-col justify-center items-center rounded-lg  p-4 px-6  bg-[#3F98F6]">
              <p className="font-semibold text-2xl text-white">
                ₹{user && Number(user.wallet_balance).toFixed(2)}
              </p>
              <p className="text-sm text-gray-200">Main Wallet</p>
            </div>
            <div className="flex w-[45%] flex-col justify-center items-center rounded-lg  p-4 px-6  bg-[#3F98F6]">
              <p className="font-semibold text-2xl text-white">
                ₹{user && Number(user.color_wallet_balnace).toFixed(2)}
              </p>
              <p className="text-sm text-gray-200">Game Wallet</p>
            </div>
          </div>

          {/* balance transfer */}
          <div className="flex justify-between w-full px-2 mt-1 ">
            <button
              onClick={() => handleButtons(1)}
              className="flex w-[45%] flex-col justify-center items-center rounded-md  py-2 px-1.5  bg-white"
            >
              <p className="text-sm text-gray-800 font-semibold flex justify-center items-center gap-2">
                Transfer To Game <FaAngleRight />
              </p>
            </button>
            <button
              onClick={() => handleButtons(2)}
              className="flex w-[45%] flex-col justify-center items-center rounded-md  py-2 px-1.5  bg-white"
            >
              <p className="text-sm text-gray-800 font-semibold flex justify-center items-center gap-2">
                <FaAngleLeft /> Transfer To Main
              </p>
            </button>
          </div>

          <Link
            to={"/home?investment=new-investment"}
            className="flex justify-between px-2 items-center gap-2 mx-2 bg-indigo-200 rounded-md  mt-4 py-1"
          >
            <div>
              <img
                alt="sudgf"
                src={require("../../assets/photos/investment.png")}
                className="w-12"
              />
            </div>
            <p className="dark:text-green-500 font-medium">
              Earn upto 5% daily interest on investment with us
            </p>
            <FaCircleChevronRight
              className="dark:text-gray-200"
              size={30}
              color="black"
            />
          </Link>

          <div className="flex flex-wrap   mt-2">
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

        {/* balance transfer popup */}
        {isOpen && (
          <div className="animate-fade-down animate-duration-500 fixed top-0 left-0 w-full h-full flex justify-center pt-10  backdrop-blur-md   z-[9999]">
            <div className=" text-white bg-gradient-to-r from-gray-700 rounded h-[60vh] to-slate-900 p-10 inline-block">
              <p className="text-xl font-medium text-center text-gray-200 border-b pb-2">
                Transfer From <br />{" "}
                {type === 1
                  ? "Main Wallet To Game Wallet"
                  : "Game Wallet To Main Wallet"}
              </p>
              <p className="mt-6">
                Your{" "}
                {type === 1 ? "Main Wallet Balance" : "Game Wallet Balance"}
                {"  "}
                {"  "}
                <span className="text-lg font-bold">
                  ₹{" "}
                  {type === 1
                    ? Number(user.wallet_balance).toFixed(2)
                    : Number(user.color_wallet_balnace).toFixed(2)}
                </span>
              </p>{" "}
              <div className="max-w-sm mt-4">
                <label
                  for="input-label"
                  className="block text-sm text-gray-300 font-medium mb-2 dark:text-white"
                >
                  Transfer To {type === 1 ? "Game Wallet" : "Main Wallet"}
                </label>
                <input
                  type="tel"
                  id="input-label"
                  className="py-2 px-4 block text-gray-200 bg-gray-700 w-full border-x-0 border-t-0 border-b-2   text-md       dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder=" "
                  value={transferToAmount}
                  onChange={(e) => setTransferToAmount(e.target.value)}
                />
                <button
                  onClick={openVerifyPin}
                  className="m-auto w-full mt-4 relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                    Transfer
                  </span>
                  <span className="relative invisible">Button Text</span>
                </button>
              </div>
              {/* close button */}
              <MdCancel
                size={30}
                onClick={() => setIsOpen(false)}
                className="cursor-pointer text-center m-auto mt-6"
              />
            </div>
          </div>
        )}

        {isVerifyOpen && (
          <VerifyPin
            onclose2={onclose2}
            successFunction={(pin) => successFunction(pin)}
          />
        )}
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
    label: "Send Money",
    icons: <RiUserSharedFill size={26} className="dark:text-white" />,
    linkTo: "/home?account=send-money",
  },
  {
    label: "Investment",
    icons: <TbMoneybag fill="white" size={26} className="dark:text-white" />,
    linkTo: "/home?investment=new-investment",
  },
  {
    label: "ROI Income",
    icons: <TbMoneybag fill="white" size={26} className="dark:text-white" />,
    linkTo: "/home?income=roi-income",
  },
  {
    label: "Level Income",
    icons: (
      <PiUserListFill fill="white" size={26} className="dark:text-white" />
    ),
    linkTo: "/home?income=level-income",
  },
  {
    label: "Reffer Income",
    icons: <FaUsers fill="white" size={26} className="dark:text-white" />,
    linkTo: "/home?income=refferer-income",
  },

  {
    label: "Matching Income",
    icons: <FaWallet size={26} className="dark:text-white" />,
    linkTo: "/home?income=matching-income",
  },
  {
    label: "Deposit History",
    icons: <FaWallet size={26} className="dark:text-white" />,
    linkTo: "/home?money=deposit-history",
  },
  {
    label: "Withdraw History",
    icons: <BsWalletFill size={26} className="dark:text-white" />,
    linkTo: "/home?money=withdrawal-history",
  },

  {
    label: "Investment History",
    icons: <TiDocumentText size={26} className="dark:text-white" />,
    linkTo: "/home?investment=investment-history",
  },

  {
    label: "Today History",
    icons: <GrDocumentText size={26} className="dark:text-white" />,
    linkTo: "/home?account=today-history",
  },
  {
    label: "Account Statement",
    icons: <FaHistory size={26} className="dark:text-white" />,
    linkTo: "/home?account=account-history",
  },
  {
    label: "Game Wallet Statement",
    icons: <IoGameController size={26} className="dark:text-white" />,
    linkTo: "/home?account=game-wallet-history",
  },
];
