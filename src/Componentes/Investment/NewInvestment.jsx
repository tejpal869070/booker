import React, { useEffect, useState } from "react";
import ViewPlans from "./ViewPlans";
import {
  GetInvestmentPlans,
  GetUserDetails,
  MakeNewInvestment,
} from "../../Controllers/User/UserController";
import { ToastContainer, toast } from "react-toastify";
import { Loading1 } from "../Loading1";
import successImg from "../../assets/photos/success1-1--unscreen.gif";
import gif1 from "../../assets/photos/growwealthgif.gif";
import VerifyPin from "../VerifyPin"; 

export default function NewInvestment() {
  const [isOpen, setIsOpen] = useState(false);
  const [PlansData, setPlansData] = useState([]);
  const [user, setUser] = useState({});
  const [amount, setAmount] = useState(100);
  const [investmentPlan, setInvestmentPlan] = useState();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifyPinPopup, setVerifyPinPop] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onclose2 = () => {
    setVerifyPinPop(false);
  };

  const successFunction = async (pin) => {
    formData.pin = pin;
    handleForm();
  };

  const formData = {
    amount: amount,
    investmentPlan: investmentPlan,
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
    }
  };

  const GetAllPlans = async () => {
    const response = await GetInvestmentPlans();
    if (response !== null) {
      setPlansData(response);
      setInvestmentPlan(response[0].id);
    } else {
      setPlansData([]);
    }
  };

  const handleForm = async () => {
    setLoading(true);
    if (investmentPlan < 0) {
      toast.error("Invalid investment plan");
      setLoading(false);
      return;
    } else if (amount > user && user.wallet_balance) {
      toast.error("Insufficient balance", {
        autoClose: 2000,
      });
      setLoading(false);
      return;
    } else if (amount < 100) {
      toast.error("Minimum Amount is Rs.100", {
        autoClose: 2000,
      });
      setLoading(false);
      return;
    }
    try {
      const response = await MakeNewInvestment(formData);
      if (response.status) {
        setSuccess(true);
        setLoading(false);
        setInvestmentPlan(PlansData[0].id);
        userDataGet();
        setAmount(100);
        setPin("");
        setTimeout(() => {
          setSuccess(false);
        }, 3500);
      } else {
        toast.error(response.response.data.message);
        setLoading(false);
      }
    } catch (error) {
      if (error.response.status === 302) {
        toast.error(error.response.data.message, {
          autoClose: 2000,
        });
        setLoading(false);
      } else {
        toast.error("Something Went Wrong. Server Error !", {
          autoClose: 2000,
        });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    GetAllPlans();
  }, []);

  useEffect(() => {
    userDataGet();
  }, []);
  

  


  if (success) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[#000000d1] bg-opacity-50 z-[9999]">
        <img alt="success" src={successImg} />
        <p className="text-2xl text-white font-semibold">Investment Success.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="   flex items-center justify-center  ">
        <div className="bg-[#e1e6ff] text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
          <div className="md:flex flex-row-reverse w-full">
            <div className=" w-full md:w-1/2 bg-indigo-500 py-10 px-10">
              <img alt="animation" className="w-full h-full " src={gif1} />
            </div>
            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
              <div className="text-center mb-6">
                <h1 className="font-bold text-3xl text-gray-900">
                  NEW INVESTMENT
                </h1>
                <p>Let Your Money Work for You.</p>
              </div>
              <p className="  font-medium text-lg text-[green] mb-4">
                Account Balance: ₹{user && user.wallet_balance || 0.00}
              </p>
              <div className="  mb-4"></div>
              <div>
                <div className="flex -mx-3">
                  <div className="w-full px-3 mb-5">
                    <label
                      for=""
                      className="text-xs font-semibold px-1 text-black"
                    >
                      Choose Plans
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <i className="mdi mdi-email-outline text-gray-400 text-lg"></i>
                      </div>
                      <select
                        onChange={(e) => setInvestmentPlan(e.target.value)}
                        defaultChecked={investmentPlan}
                        className="w-full -ml-10  pr-3 py-2 text-black font-medium rounded-lg border-2 border-gray-200 outline-none focus:border-none"
                      >
                        {PlansData &&
                          PlansData?.map((item, index) => (
                            <option
                              key={index}
                              value={item.id}
                              className="font-semibold cursor-pointer"
                            >
                              {item.plan_name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex -mx-3">
                  <div className="w-full px-3 mb-8">
                    <label
                      for=""
                      className="text-xs font-semibold px-1 text-black"
                    >
                      Amount
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <i className="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full -ml-10  pr-3 py-2 rounded-lg text-black font-medium border-2 border-gray-200 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <p className="text-gray-700 text-xs italic">
                      Minimum Amount is ₹100
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap   gap-6  ">
                  <button
                    className="relative"
                    onClick={() => setVerifyPinPop(true)}
                    disabled={amount < 100}
                  >
                    <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-500"></span>
                    <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                      {loading ? <Loading1 width={30} /> : "SUBMIT"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 items-center justify-center py-4">
        <p className="animate-bounce shadow-xl focus:animate-none   inline-flex text-xl font-medium bg-indigo-900 mt-3 px-4 py-2 rounded-lg tracking-wide text-white">
          <span className="ml-2">OUR INVESTMENT PLANS 🏀</span>
        </p>
        <p className="underlined font-medium text-gray-800 dark:text-gray-200">Enter Amount Above To Calculate Returns</p>
      </div>


      <div className="flex flex-wrap   gap-4   py-3  ">
        {PlansData &&
          PlansData.map((item, index) => (
            <div
              key={index}
              className=" min-w-full shadow-lg   md:min-w-[48%] lg:min-w-[24%] flex   space-y-8 items-start flex-col bg-[#6489fd26] rounded-3xl border border-gray-200 bg-white p-6 text-gray-900 xl:p-8"
            >
              <h3 className="text-lg font-medium dark:text-gray-800">{item.plan_name}</h3>
              <div className="my-8 flex items-baseline justify-center ">
                <span className="mr-2 text-2xl font-extrabold dark:text-gray-800">
                  ₹
                  {(
                    (Number((amount * item.percentage) / 100) +
                      Number(amount)) /
                    item.times
                  ).toFixed(0)}
                  /{item.plan_name}
                </span>
                {/* <span className="text-gray-600">/{item.plan_name}</span> */}
              </div>

              {/* <p className="font-light text-gray-600 sm:text-sm">
                Best option for personal use & for your next project.
              </p> */}

              <ul
                role="list"
                className="mb-8 space-y-4 text-left text-gray-600  text-sm"
              >
                <li className="dark:text-gray-800 flex items-center space-x-3 ">
                  <svg
                    className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>
                    {item.times} {item.title} Payout
                  </span>
                </li>
                <li className="dark:text-gray-800 flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 flex-shrink-0 bg-gray-900 rounded-full p-0.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>{item.percentage}% Interest Rate</span>
                </li>
              </ul>

              <a className="cursor-pointer bg-gray-900 dark:bg-indigo-800 w-full rounded-md  p-3 text-center text-sm font-semibold text-white shadow-sm  hover:-translate-y-1">
                Total Return: ₹
                {(
                  Number((amount * item.percentage) / 100) + Number(amount)
                ).toFixed(0)}
              </a>
            </div>
          ))}
      </div>

      {isOpen && <ViewPlans onClose={onClose} />}
      {verifyPinPopup && (
        <VerifyPin
          onclose2={onclose2}
          successFunction={(pin) => successFunction(pin)}
        />
      )}
      <ToastContainer />
    </div>
  );
}
