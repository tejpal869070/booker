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
      <div class="   flex items-center justify-center  ">
        <div class="bg-[#e1e6ff] text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
          <div class="md:flex flex-row-reverse w-full">
            <div class="hidden md:block w-1/2 bg-indigo-500 py-10 px-10">
              <img alt="animation" className="w-full h-full " src={gif1} />
            </div>
            <div class="w-full md:w-1/2 py-10 px-5 md:px-10">
              <div class="text-center mb-6">
                <h1 class="font-bold text-3xl text-gray-900">NEW INVESTMENT</h1>
                <p>Let Your Money Work for You.</p>
              </div>
              <p className="  font-medium text-lg text-[green] mb-4">
                Account Balance: ₹{user && user.wallet_balance}
              </p>
              <div className="  mb-4">
                <button
                  onClick={() => setIsOpen(true)}
                  className="animate-bounce shadow-xl focus:animate-none   inline-flex text-md font-medium bg-indigo-900 mt-3 px-4 py-2 rounded-lg tracking-wide text-white"
                >
                  <span className="ml-2">View Plans 🏀</span>
                </button>
              </div>
              <div>
                <div class="flex -mx-3">
                  <div class="w-full px-3 mb-5">
                    <label for="" class="text-xs font-semibold px-1 text-black">
                      Choose Plans
                    </label>
                    <div class="flex">
                      <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <i class="mdi mdi-email-outline text-gray-400 text-lg"></i>
                      </div>
                      <select
                        onChange={(e) => setInvestmentPlan(e.target.value)}
                        defaultChecked={investmentPlan}
                        class="w-full -ml-10  pr-3 py-2 text-black font-medium rounded-lg border-2 border-gray-200 outline-none focus:border-none"
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
                <div class="flex -mx-3">
                  <div class="w-full px-3 mb-8">
                    <label for="" class="text-xs font-semibold px-1 text-black">
                      Amount
                    </label>
                    <div class="flex">
                      <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <i class="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        class="w-full -ml-10  pr-3 py-2 rounded-lg text-black font-medium border-2 border-gray-200 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap   gap-6  ">
                  <button
                    className="relative"
                    onClick={() => setVerifyPinPop(true)}
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
