import React, { useEffect, useState } from "react";
import gif1 from "../../../../assets/photos/bitcoingif.gif";
import {
  AddCryptoWithdrawalRequest,
  GetUserDetails,
} from "../../../../Controllers/User/UserController";
import { Loading1 } from "../../../Loading1";
import VerifyPin from "../../../VerifyPin";
import { ToastContainer, toast } from "react-toastify";

export default function CryptoWithdrawal() {
  const inputClasses =
    "shadow-sm w-full bg-gray-50 font-medium border border-gray-300 dark:bg-gray-400 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5";

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(10);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const onclose2 = () => {
    setIsOpen(false);
  };

  const formData = {
    amount: amount,
    address: address,
    price_at_time: user.currency_rate,
    currency: user.currency,
  };

  const successFunction = async (pin) => {
    try {
      const response = await AddCryptoWithdrawalRequest(formData, pin);
      if (response.status) {
        setProcessing(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3500);
        setAddress("");
        setAmount(10);
      } else {
        toast.error("Something Went Wrong !", {
          position: "bottom-right",
        });
        setProcessing(false);
      }
    } catch (error) { 
      if (error?.response.status === 302) {
        toast.error(`${error.response.data.message}`, {
          position: "bottom-right",
        });
        setProcessing(false);
      } else {
        toast.error("Server Error !", {
          position: "bottom-right",
        });
        setProcessing(false);
      }
    }
  };

  const handle1 = async () => {
    if (amount < 10) {
      toast.error("Minimum Withdrawal is 10", {
        position: "bottom-right",
      });
      return;
    } else if (address.length < 10) {
      toast.error("Invalid Address", {
        position: "bottom-right",
      });
      return;
    }  
    setIsOpen(true);
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setLoading(false);
    } else {
      setLoading(false);
      window.alert("Something Went Wrong !");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading1 />
      </div>
    );
  }

  return (
    <div class="   flex items-center justify-center  ">
      <div class="bg-[#e1e6ff] dark:bg-[#868ba3fc] text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
        <div class="md:flex flex-row-reverse w-full">
          <div class="hidden md:block w-1/2 bg-indigo-200  p-2">
            <img alt="animation" className="w-full h-full " src={gif1} />
          </div>
          <div class="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div class="  mb-6">
              <h1 class="font-bold text-3xl text-gray-900">
                CRYPTO WITHDRAWAL
              </h1>
            </div>
            <p className="  font-medium text-lg dark:text-[#d4e11d] text-[green] mb-4">
              Crypto Balance ({user.currency}) :{" "}
              {user &&
                (user.wallet_balance / Number(user.currency_rate)).toFixed(2)}
            </p>

            <div className="grid grid-cols-12 gap-6 mt-10">
              <div className="col-span-12  ">
                <label
                  for="product-name"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  {user.currency} Address*
                </label>
                <input
                  type="text"
                  name="product-name"
                  id="product-name"
                  className={`${inputClasses}`}
                  placeholder=""
                  // disabled={!editing}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="col-span-12  ">
                <label
                  for="product-name"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Quantity*
                </label>
                <input
                  type="text"
                  name="product-name"
                  id="product-name"
                  className={`${inputClasses}`}
                  placeholder=""
                  // disabled={!editing}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-gray-800 font-medium text-sm">
                  Rs. {(amount * Number(user.currency_rate)).toFixed(2)} Will Be
                  duducted{" "}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap   gap-6 mt-6">
              <button onClick={handle1} className="relative">
                <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                  {processing ? <Loading1 /> : "SUBMIT"}
                </span>
              </button>
              <button
                className="relative"
                onClick={() => {
                  setAddress("");
                  setAmount("");
                }}
              >
                <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                  CLEAR
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <VerifyPin
          onclose2={onclose2}
          successFunction={(pin) => successFunction(pin)}
        />
      )}
      
      
      <ToastContainer />
    </div>
  );
}
