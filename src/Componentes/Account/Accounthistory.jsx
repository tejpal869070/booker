import React, { useCallback, useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import AccountHistoryPeriod from "./AccountHistoryPeriod";
import gif1 from "../../assets/photos/nodata.png";
import { GetAccountAllStatement } from "../../Controllers/User/UserController";
import DateSelector from "../Income/DateSelector";
import { Loading1 } from "../Loading1";
import { useLocation } from "react-router-dom";

export default function AccountHistory() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState([]);

  const location = useLocation();

  const showModal = useCallback(
    (index) => {
      setIsVisible((pre) => !pre);
      setSelectedIndex(index);
    },
    [setIsVisible, setSelectedIndex]
  );

  const GetAllStatement = async () => {
    try {
      const response = await GetAccountAllStatement();
      if (response.status) {
        setData(response.data.reverse());
        setLoading(false);
      } else {
        window.alert("Something Went Wrong."); 
        setData([]);
        setLoading(false);
      }
    } catch (error) {
      window.alert("Something Went Wrong."); 
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    GetAllStatement();
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
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading1 />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className=" ">
        <div>
          <h1 className="mb-6 font-bold text-lg dark:text-white ">
            Account {">"}Account History
          </h1>
          {/* <AccountHistoryPeriod /> */}
          <DateSelector />
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
            {filteredData && filteredData.length === 0 ? (
              <div>
                <img alt="no data" src={gif1} className="m-auto w-40" />
                <p className="text-center font-bold text-xl">No Records !</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs font-semibold text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      S.No.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      TYPE
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Transaction Detail
                    </th>
                    <th scope="col" className="px-6 py-3">
                      AMOUNT
                    </th>
                    <th scope="col" className="px-6 py-3">
                      SENT TO
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Received From
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Remaining Balance
                    </th>
                  </tr>
                </thead>
                {filteredData.map((item, index) => (
                  <tbody key={index}>
                    <tr
                      key={index}
                      className={` text-black font-semibold dark:text-gray-200  border-b dark:border-gray-700 ${
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
                        {item.type}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.date.split("T")[0]}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.type === "Investment" || item.type === "Investment Return"  ? "$ " : "₹ "}
                        {item.amount}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.description.split(" ").includes("To")
                          ? item.description.split(" ")[2]
                          : ""}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.description.split(" ").includes("from")
                          ? item.description.split(" ")[2]
                          : ""}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        ₹{Number(item.balance).toFixed(2)}
                      </td>
                    </tr>
                    {isVisible && selectedIndex === index ? (
                      <tr>
                        <td colspan="7" className="text-center p-4">
                          No Records Found!
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                  </tbody>
                ))}
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
