import React, { useEffect, useState } from "react";
import { GetUserPaymentHistory } from "../../../Controllers/User/UserController";
import { FaEye } from "react-icons/fa";
import { Loading1 } from "../../Loading1";
import gif1 from "../../../assets/photos/nodata.png";
import DateSelector from "../../Income/DateSelector";
import { useLocation } from "react-router-dom";

export default function DepositHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState();
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState([]);

  const location = useLocation();

  const GetPaymentHistory = async () => {
    const response = await GetUserPaymentHistory();
    if (response !== null) {
      setData(
        response
          .reverse()
          .filter(
            (item) => item.payment_type === "Deposit" || item.image !== null
          )
      );
      setLoading(false);
    } else {
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    GetPaymentHistory();
  }, []);

  useEffect(() => {
    const start = new URLSearchParams(location.search).get("from");
    const end = new URLSearchParams(location.search).get("to");
    setStartDate(start);
    setEndDate(end);
  }, [location]);

  useEffect(() => {
    // Create a new date object for the endDate and set it to the end of the day
    const endDateObj = new Date(endDate);
    endDateObj.setHours(23, 59, 59, 999);

    if (startDate === null || endDate === null) {
      setFilteredData(data);
    } else {
      // Filter data between startDate and endDate
      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        const startDateObj = new Date(startDate);
        return itemDate >= startDateObj && itemDate <= endDateObj;
      });
      setFilteredData(filteredData);
    }
  }, [startDate, endDate, data]);

  if (loading) {
    return (
      <div>
        <Loading1 />
      </div>
    );
  }

  return (
    <div className=" ">
      <div>
        <h1 className="mb-6 font-bold text-lg dark:text-gray-100">
          Money In {">"}Deposit History
        </h1>
        <DateSelector />
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {filteredData && filteredData.length === 0 ? (
            <div>
              <img alt="no data" src={gif1} className="m-auto" />
              <p className="text-center font-bold text-xl">No Records !</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-4 border-indigo-400">
              <thead className="text-xs font-semibold text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    S.No.
                  </th>
                  <th scope="col" className="px-4 py-3">
                    AMOUNT
                  </th>
                  <th scope="col" className="hidden md:table-cell px-6 py-3">
                    Transaction Hash
                  </th>
                  <th scope="col" className="hidden md:table-cell px-6 py-3">
                    TYPE
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    View
                  </th>
                </tr>
              </thead>
              {filteredData.length === 0 ? (
                <tbody>
                  <tr>
                    <td colspan="8" className="text-center p-4">
                      No Records Found!
                    </td>
                  </tr>
                </tbody>
              ) : (
                filteredData &&
                filteredData.map((item, index) => (
                  <tbody>
                    <tr
                      key={index}
                      className="odd:bg-white text-black font-semibold dark:text-gray-200 odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
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
                      <td className="whitespace-nowrap px-6 py-4 hidden md:table-cell">
                        {item.transaction_id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 hidden md:table-cell">
                        {item.payment_type === "USDT" ? "Crypto" : item.type}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">{item.status}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <FaEye
                          size={20}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedIndex(index);
                            setVisible((pre) => !pre);
                          }}
                        />
                      </td>
                    </tr>
                    {visible && selectedIndex === index ? (
                      <tr className=" bg-gray-300 dark:bg-black animate-fade-down animate-duration-500">
                        {item.type === "UPI" ? (
                          <td colSpan="8 ">
                            <div className="p-6 text-black font-medium dark:text-gray-200   ">
                              <p>Transaction ID: {item.transaction_id}</p>
                              <p>Amount: {item.amount}</p>
                              <p>Date: {item.date.split(" ")[0]}</p>
                              <p>Transfered To: {item.upi_id}</p>
                              <p>Status: {item.status}</p>
                              {item.status === "Cancelled" ? (
                                <p>Cancel Reason : {item.reason} </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </td>
                        ) : item.type === "Bank" ? (
                          <td colSpan="8">
                            <div className="p-6 text-black font-medium dark:text-gray-200   border-gray-700">
                              <p>Transaction ID: {item.transaction_id}</p>
                              <p>Amount: {item.amount}</p>
                              <p>Date: {item.date.split(" ")[0]}</p>
                              <p>Transfered To:-{">"} </p>
                              <div>
                                <p>Account Holder: {item.name}</p>
                                <p>Account No.: {item.ac_no}</p>
                                <p>Bank Name: {item.bank_name}</p>
                                <p>IFSC: {item.ifsc_code}</p>
                              </div>
                              <p>Status: {item.status}</p>
                              {item.status === "Cancelled" ? (
                                <p>Cancel Reason : {item.reason} </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </td>
                        ) : (
                          <td colSpan="8">
                            <div className="p-6 text-black font-medium dark:text-gray-200   border-gray-700">
                              <p>Transaction ID: {item.transaction_id}</p>
                              <p>
                                Amount: {item.amount} {item.currency} (
                                {Number(item.amount) *
                                  Number(item.price_at_that_time)}{" "}
                                INR)
                              </p>
                              <p>Price: {item.price_at_time} INR</p>
                              <p>Date: {item.date.split(" ")[0]}</p>
                              <p>Transfered To: {item.cypto}</p>

                              <p>Status: {item.status}</p>
                              {item.status === "Cancelled" ? (
                                <p>Cancel Reason : {item.reason} </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ) : (
                      ""
                    )}
                  </tbody>
                ))
              )}
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
