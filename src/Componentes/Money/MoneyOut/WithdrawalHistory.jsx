import React, { useCallback, useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import {
  GetUserPaymentHistory,
  RemoveWithdrawalRequest,
} from "../../../Controllers/User/UserController";
import { Loading1, Loading3, Loading4 } from "../../Loading1";
import gif1 from "../../../assets/photos/nodata.png";
import { useLocation } from "react-router-dom";
import DateSelector from "../../Income/DateSelector";
import { MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

export default function WithdrawalHistory() {
  const classes1 = "flex justify-between border-b border-gray-400";

  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [singleData, setSingleData] = useState();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState([]);

  const location = useLocation();

  const handleCancelWithdrawalRequest = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this withdrawal request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });
    if (result.isConfirmed) {
      try {
        const response = await RemoveWithdrawalRequest(id);
        if (response.status) {
          toast.success("Withdrawal Request Cancelled", {
            position: "top-center",
          });
          await GetPaymentHistory();
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage, {
          position: "top-center",
        });
      }
    }
  };

  const GetPaymentHistory = async () => {
    const response = await GetUserPaymentHistory();
    if (response) {
      setData(
        response
          .reverse()
          .filter(
            (item) => item.payment_type === "Withdrawal" || item.image === null
          )
      );
    } else {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    GetPaymentHistory();
  }, []);

  const showModal = useCallback((index) => {
    setIsVisible((pre) => !pre);
    setSelectedIndex(index);
  }, []);

  useEffect(() => {
    const start = new URLSearchParams(location.search).get("from");
    const end = new URLSearchParams(location.search).get("to");
    setStartDate(start);
    setEndDate(end);
  }, [location]);

  useEffect(() => {
    const endDateObj = new Date(endDate);
    endDateObj.setHours(23, 59, 59, 999);

    if (startDate && endDate) {
      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        const startDateObj = new Date(startDate);
        return itemDate >= startDateObj && itemDate <= endDateObj;
      });
      setFilteredData(filteredData);
    } else {
      setFilteredData(data);
    }
  }, [startDate, endDate, data]);

  if (loading) {
    return (
      <div className="  flex justify-center items-center min-h-[40vh] md:min-h-[90vh] bg-opacity-50 z-[9999]">
        <Loading4 />
      </div>
    );
  }

  return (
    
    <div className="relative h-screen">
      <ToastContainer />
      <div>
        <h1 className="mb-6 font-bold dark:text-gray-200 text-lg text-center md:text-left hidden md:blocks">
          Withdrawal History
        </h1>

        <div className="md:text-left hidden md:block">
          <DateSelector />
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {filteredData.length === 0 ? (
            <div>
              <img alt="no data" src={gif1} className="m-auto w-40" />
              <p className="text-center dark:text-gray-200 font-bold text-xl">
                No Records !
              </p>
            </div>
          ) : (
            <div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-4 border-indigo-400 hidden md:inline-table">
                <thead className="text-xs font-semibold text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      S.No.
                    </th>
                    <th scope="col" className="px-4 py-3">
                      AMOUNT
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="hidden md:table-cell px-6 py-3">
                      DATE
                    </th>
                    <th scope="col" className="px-6 py-3">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`text-black font-semibold dark:text-gray-200 border-b dark:border-gray-700 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                      >
                        {index + 1}.
                      </th>
                      <td className="whitespace-nowrap px-4 py-4">
                        {item.currency === null ? "₹ " : ""}
                        {item.amount} {item.currency}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 ">
                        {item.status}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 hidden md:table-cell">
                        {item.date.split("T")[0]}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 flex justify-left items-center gap-2">
                        <FaRegEye
                          size={20}
                          className="cursor-pointer"
                          onClick={() => {
                            showModal(index);
                            setSingleData(item);
                          }}
                        />
                        {item.status === "Pending" && (
                          <MdCancel
                            size={20}
                            className="cursor-pointer text-red-500"
                            onClick={() =>
                              handleCancelWithdrawalRequest(item.id)
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-col md:hidden pb-16">
                {filteredData &&
                  filteredData?.map((item, index) => (
                    <div className="rounded  shadow-lg bg-gray-800 p-3 mb-4">
                      <section className="border-b-[0.5px] border-gray-600 pb-2  flex justify-between items-center font-semibold  ">
                        <p className="px-2 bg-indigo-500 inline text-gray-200 rounded py-1">
                          {item.payment_type === "USDT" ? "Crypto" : item.type}
                        </p>
                        <p
                          className={` ${
                            item.status === "Cancelled"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {item.status}
                        </p>
                      </section>
                      <div className="pt-2 font-thin flex flex-col gap-1">
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">Amount</p>
                          <p className="text-[#FEAA57]">
                            {item.type === "USDT" ? "$ " : "₹ "}
                            {item.amount}
                          </p>
                        </section>
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">Time</p>
                          <p className="text-gray-200 font-normal">
                            {item.date.split("T")[0]}
                          </p>
                        </section>
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">
                            Withdrawal Id
                          </p>
                          <p className="text-gray-200 font-normal">{item.id}</p>
                        </section>
                        {item.status === "Cancelled" && (
                          <section className="flex justify-between   font-bold  ">
                            <p className="text-gray-400 font-normal">Reason</p>
                            <p className="text-gray-400 font-normal max-w-[60%]">
                              {item.reason}
                            </p>
                          </section>
                        )}
                        {item.status === "Pending" ? (
                          <section className="flex justify-between items-center font-bold  ">
                            <p
                              className="text-gray-800  w-[48%] text-center py-2 rounded bg-green-200"
                              onClick={() => {
                                showModal(index);
                                setSingleData(item);
                              }}
                            >
                              View
                            </p>
                            <p
                              className="text-gray-800  w-[48%] text-center py-2 rounded bg-red-400"
                              onClick={() =>
                                handleCancelWithdrawalRequest(item.id)
                              }
                            >
                              Cancel Request
                            </p>
                          </section>
                        ) : (
                          <p
                            className="text-gray-800  w-full font-medium text-center py-2 rounded bg-green-200"
                            onClick={() => {
                              showModal(index);
                              setSingleData(item);
                            }}
                          >
                            View
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Details */}
      {isVisible && (
        <div className="animate-fade-down animate-duration-500 fixed top-0 left-0 w-full h-full flex justify-center pt-10 backdrop-blur-md z-[9999]">
          <div className="text-white bg-gradient-to-r from-gray-700 rounded h-[70vh] to-slate-900 p-10 inline-block">
            <h1 className="text-center text-2xl font-bold">
              WITHDRAWAL DETAIL
            </h1>
            <div className="flex flex-col mt-6 gap-2">
              <div className={`${classes1}`}>
                <p>Amount :</p>
                <p>
                  {singleData.amount} {singleData.currency}
                </p>
              </div>

              <div className={`${classes1}`}>
                <p>Status :</p>
                <p>{singleData.status}</p>
              </div>

              {singleData.status === "Cancelled" && (
                <div className={`${classes1}`}>
                  <p>Cancel Reason :</p>
                  <p>{singleData.reason}</p>
                </div>
              )}

              {singleData.currency !== null && (
                <div className={`${classes1}`}>
                  <p>To :</p>
                  <p>
                    {singleData.cypto.slice(0, 8)}...
                    {singleData.cypto.slice(-6)}
                  </p>
                </div>
              )}

              {singleData.currency !== null && (
                <div className={`${classes1}`}>
                  <p>At Price :</p>
                  <p>{singleData.price_at_that_time} INR</p>
                </div>
              )}
              {singleData.currency !== null && (
                <div className={`${classes1}`}>
                  <p>Transfer Amount :</p>
                  <p>
                    {(
                      singleData.price_at_that_time * singleData.amount
                    ).toFixed(2)}{" "}
                    INR
                  </p>
                </div>
              )}

              <div
                className={`${
                  singleData.currency !== null ? "hidden" : "block"
                } ${classes1}`}
              >
                <p>Account Holder :</p>
                <p>{singleData.name}</p>
              </div>

              <div
                className={`${
                  singleData.currency !== null ? "hidden" : "block"
                } ${classes1}`}
              >
                <p>Bank Name :</p>
                <p>{singleData.bank_name}</p>
              </div>

              <div
                className={`${
                  singleData.currency !== null ? "hidden" : "block"
                } ${classes1}`}
              >
                <p>Account No. :</p>
                <p>{singleData.ac_no}</p>
              </div>

              <div
                className={`${
                  singleData.currency !== null ? "hidden" : "block"
                } ${classes1}`}
              >
                <p>IFSC Code :</p>
                <p>{singleData.ifsc_code}</p>
              </div>

              <div className={`${classes1}`}>
                <p>Date :</p>
                <p>{singleData.date.split("T")[0]}</p>
              </div>
              <div className={`${classes1}`}>
                <p>Time :</p>
                <p>{singleData.date.split("T")[1]}</p>
              </div>
            </div>
            <MdCancel
              size={30}
              onClick={() => setIsVisible(false)}
              className="cursor-pointer mt-8 flex justify-center m-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
