import React, { useCallback, useEffect, useState } from "react";
import gif1 from "../../assets/photos/nodata.png";
import { GetGameWalletStatement } from "../../Controllers/User/UserController";
import DateSelector from "../Income/DateSelector";
import { Loading1 } from "../Loading1";
import { useLocation } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";

export default function GameWalletHistory() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [pageId, setPageId] = useState(1);

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
      const response = await GetGameWalletStatement(pageId);
      if (response.status) {
        setData(response.data);
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
  }, [pageId]);

  useEffect(() => {
    const start = new URLSearchParams(location.search).get("from");
    const end = new URLSearchParams(location.search).get("to");
    setStartDate(start);
    setEndDate(end);
  }, [location]);

  useEffect(() => { 
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
            Account {"> "}Game Wallet History
          </h1>
          {/* <AccountHistoryPeriod /> */}
          <DateSelector />
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
            {filteredData && filteredData.length === 0 ? (
              <div>
                <img alt="no data" src={gif1} className="m-auto w-60" />
                <p className="text-center dark:text-white font-bold text-xl">
                  No Records !
                </p>
              </div>
            ) : (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs font-semibold text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      ID.
                    </th>
                    {/* <th scope="col" className="px-6 py-3">
                      TYPE
                    </th> */}
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      AMOUNT
                    </th>
                    <th scope="col" className="px-6 py-3">
                      GAME NAME
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Desc.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Remaining Balance
                    </th>
                  </tr>
                </thead>
                {filteredData.map((item, index) => (
                  <tbody key={index}>
                    <tr
                      className={` text-black font-semibold dark:text-gray-200  border-b dark:border-gray-700 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    >
                      <th
                        scope="row"
                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.id}.
                      </th>
                      {/* <td className="px-4 py-2">{item.type}</td> */}
                      <td className="px-6 py-2">{item.date?.split("T")[0]}</td>
                      <td
                        className={`px-6 py-2 ${
                          item.bet_type === "Win Bet" ||
                          item.game_type === "Received"
                            ? "text-[green]"
                            : "text-red-600"
                        }`}
                      >
                        {item.bet_type === "Win Bet" ||
                        item.game_type === "Received"
                          ? "+"
                          : "-"}
                        ₹{Number(item.bet_balance).toFixed(2)}
                      </td>
                      <td className="px-6 py-2">{item.game_type}</td>
                      <td className="px-6 py-2">{item.bet_type}</td>
                      <td className="px-6 py-2">₹{item.total_balance}</td>
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
          <div className="flex items-center gap-2 text-black dark:text-white">
            <button
              disabled={pageId === 1}
              onClick={() => setPageId(pageId - 1)}
            >
              <FaArrowCircleLeft size={20} className="cursor-pointer " />
            </button>
            {pageId}
            <button
              disabled={data && data.length <= 99}
              onClick={() => setPageId(pageId + 1)}
            >
              <FaArrowCircleRight size={20} className="cursor-pointer " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
