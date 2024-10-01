import React, { useEffect, useState } from "react";
import {
  AddWithdrawalRequest,
  GetUserDetails,
  UpdateUserDetails,
} from "../../../../Controllers/User/UserController";
import { Loading1 } from "../../../Loading1";
import { ToastContainer, toast } from "react-toastify";
import successImg from "../../../../assets/photos/success1-1--unscreen.gif";
import swal from "sweetalert";
import gif1 from "../../../../assets/photos/withdrawgif.gif";
import VerifyPin from "../../../VerifyPin";

const inputClasses =
  "shadow-sm bg-gray-50 font-medium border border-gray-300 dark:bg-gray-400 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5";

export default function BankWithDrawal() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [ac_name, setAccName] = useState("");
  const [ac_no, setAccNo] = useState("");
  const [ifsc_code, setIfsc] = useState("");
  const [bank_name, setBankName] = useState("");
  const [amount, setAmount] = useState(100);
  const [processing, setProcessing] = useState(false);
  const [withdrawaing, setWithdrawaing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userHaveBank, setUserHaveBank] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const onclose2 = () => {
    setIsOpen(false);
  };

  const successFunction = async (pin) => {
    handleWithdrawal(pin);
  };

  const formData = {
    ac_name: ac_name,
    ac_no: ac_no,
    ifsc_code: ifsc_code,
    bank_name: bank_name,
  };

  const editBank = async () => {
    setProcessing(true);
    if (ac_name === null || ac_name.length < 4) {
      toast.error("Invalid Beneficary Name", {
        position: "bottom-right",
      });
      setProcessing(false);
      return;
    } else if (ac_no === null || ac_no.length < 10) {
      toast.error("Invalid Account Number", {
        position: "bottom-right",
      });
      setProcessing(false);
      return;
    } else if (ifsc_code === null || ifsc_code.length !== 11) {
      toast.error("Invalid IFSC Code", {
        position: "bottom-right",
      });
      setProcessing(false);
      return;
    } else if (bank_name === null || bank_name.length < 3) {
      toast.error("Invalid Bank Name", {
        position: "bottom-right",
      });
      setProcessing(false);
      return;
    }
    try {
      const response = await UpdateUserDetails(formData);
      if (response.status) {
        toast.success("Bank Details Updated Successfully", {
          position: "bottom-right",
        });
        userDataGet();
        setProcessing(false);
      } else {
        toast.error("Failed to Update Bank Details", {
          position: "bottom-right",
        });
        setProcessing(false);
      }
    } catch (error) {
      toast.error("Server Error or Try to Re-Login", {
        position: "bottom-right",
      });
      setProcessing(false);
    }
  };

  const handleWithdrawal = async (pin) => {
    setWithdrawaing(true);
    if (amount < 100) {
      toast.error("Minimum withdrawal amount is 100", {
        position: "bottom-right",
      });
      setWithdrawaing(false);
      return;
    }
    try {
      const response = await AddWithdrawalRequest(pin, amount);
      if (response.status) {
        setSuccess(true);
        setWithdrawaing(false);
        userDataGet();
        setTimeout(() => {
          setSuccess(false);
        }, 3500);
      } else {
        toast.error("Failed to Withdraw", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      if (error.response.status === 302) {
        swal("Error!", `${error.response.data.message}`, "error");
        setWithdrawaing(false);
      } else {
        toast.error("Server Error !", {
          position: "bottom-right",
        });
        setWithdrawaing(false);
      }
    }
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setAccName(response[0].ac_name);
      setAccNo(response[0].ac_no);
      setIfsc(response[0].ifsc_code);
      setBankName(response[0].bank_name);
      setLoading(false);
      if (
        response[0].ac_name !== null ||
        response[0].ac_name !== null ||
        response[0].bank_name !== null ||
        response[0].ifsc_code !== null
      ) {
        setUserHaveBank(true);
      }
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

  if (success) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[#000000d1] bg-opacity-50 z-[9999]">
        <img alt="success" src={successImg} />
        <p className="text-2xl text-white font-semibold">
          Withdrawal Success !
        </p>
      </div>
    );
  }

  return (
    <div className="z-[9999] relative">
      <div class="   flex items-center justify-center  ">
        <div class="bg-[#e1e6ff] dark:bg-[#868ba3fc] text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
          <div class="md:flex flex-row-reverse w-full">
            <div class="hidden md:block w-1/2 bg-indigo-200  p-2">
              <img alt="animation" className="w-full h-full " src={gif1} />
            </div>
            <div class="w-full md:w-1/2 py-10 px-5 md:px-10">
              <div class="  mb-6">
                <h1 class="font-bold text-3xl text-gray-900">
                  BANK WITHDRAWAL
                </h1>
              </div>
              <p className="  font-medium text-lg text-[green] mb-4">
                Account Balance: ₹{user && user.wallet_balance}
              </p>

              <div>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      for="product-name"
                      className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                    >
                      Beneficary Name *
                    </label>
                    <input
                      type="text"
                      name="product-name"
                      id="product-name"
                      className={`${inputClasses} ${
                        !editing ? "cursor-not-allowed" : ""
                      }`}
                      placeholder=""
                      disabled={!editing}
                      value={ac_name}
                      onChange={(e) => setAccName(e.target.value)}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      for="category"
                      className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                    >
                      Account Number *
                    </label>
                    <input
                      type="number"
                      name="category"
                      id="category"
                      className={`${inputClasses} ${
                        !editing ? "cursor-not-allowed" : ""
                      }`}
                      placeholder=""
                      disabled={!editing}
                      required
                      value={ac_no}
                      onChange={(e) => setAccNo(e.target.value)}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      for="brand"
                      className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                    >
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      id="brand"
                      className={`${inputClasses} ${
                        !editing ? "cursor-not-allowed" : ""
                      }`}
                      placeholder=""
                      disabled={!editing}
                      required
                      value={bank_name}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      for="product-details"
                      className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                    >
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      className={`${inputClasses} ${
                        !editing ? "cursor-not-allowed" : ""
                      }`}
                      placeholder=""
                      disabled={!editing}
                      required
                      value={ifsc_code}
                      onChange={(e) => setIfsc(e.target.value)}
                    />
                  </div>

                  <div
                    className={`col-span-6 sm:col-span-3 ${
                      editing ? "hidden" : ""
                    }`}
                  >
                    <label
                      for="product-details"
                      className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                    >
                      Withdrawal Amount *
                    </label>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      placeholder=""
                      className={`${inputClasses}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  {userHaveBank && editing && (
                    <div className="col-span-6">
                      <label
                        for="product-details"
                        className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                      >
                        Reason of Updation *
                      </label>
                      <input
                        type="text"
                        name="price"
                        id="price"
                        placeholder=""
                        className={`${inputClasses}`}
                        // value={amount}
                        // onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                {editing ? (
                  <div className="flex flex-wrap justify-between w-full gap-6 mt-6">
                    {!userHaveBank ? (
                      <button onClick={editBank} className="relative">
                        <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                        <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                          {processing ? <Loading1 width={28} /> : "SAVE"}
                        </span>
                      </button>
                    ) : (
                      <button className="relative">
                        <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                        <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                          Send For Update
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => setEditing(false)}
                      className="relative"
                    >
                      <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-gray-700 dark:bg-gray-400"></span>
                      <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-black px-3 py-1 text-base font-bold text-white transition duration-100 hover:bg-gray-900 hover:text-yellow-500">
                        CLOSE
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-6 mt-6">
                    <button
                      onClick={() => setIsOpen(true)}
                      className="relative"
                      disabled={
                        (user && user.ac_no === null) ||
                        user.ac_name === null ||
                        user.bank_name === null ||
                        user.ifsc_code === null
                      }
                    >
                      <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                      <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                        {withdrawaing ? (
                          <Loading1 width={28} />
                        ) : (
                          "CONFIRM WITHDRAWAL"
                        )}
                      </span>
                    </button>
                    <button
                      className="relative"
                      onClick={() => setEditing(true)}
                    >
                      <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                      <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                        EDIT BANK DETAILS
                      </span>
                    </button>
                  </div>
                )}
              </div>
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
