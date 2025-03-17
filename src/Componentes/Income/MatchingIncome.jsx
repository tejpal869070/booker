import React, { useEffect, useState } from "react";
import DateSelector from "./DateSelector";
import { useLocation } from "react-router-dom";
import { GetMatchingIncome } from "../../Controllers/User/UserController";

export default function MatchingIncome() {
  const [tableData, setTableData] = useState([]);
  const location = useLocation();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState([]);

  const tableHead = ["S.No.", "Plan name", "Matched user", "INcome", "Date"];

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetMatchingIncome();
      if (response !== null) {
        const updatedData = response?.map((item) => {
          const { id, reffer_by, reffer_code, ...rest } = item;
          return rest;
        });
        setTableData(updatedData);
      } else {
        setTableData([]);
      }
    };

    fetchData();
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
      setFilteredData(tableData);
    } else {
      // Filter data between startDate and endDate
      const filteredData = tableData.filter((item) => {
        const itemDate = new Date(item.date);
        const startDateObj = new Date(startDate);
        return itemDate >= startDateObj && itemDate <= endDateObj;
      });
      setFilteredData(filteredData);
    }
  }, [startDate, endDate, tableData]);

  return (
    <div className="min-h-screen">
      <p className="font-bold text-xl mb-6 dark:text-white">
        Income Manager {">"} Matching Income
      </p>
      <DateSelector />
      <div>
        {filteredData?.length === 0 ? (
          <div className="border-y-[0.2px] border-gray-400 py-4">
            <img
              alt="no data"
              src={require("../../assets/photos/nodata.png")}
              className="w-40 mx-auto"
            />
            <p className="text-center dark:text-white font-semibold">
              No Record
            </p>
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-800 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {tableHead.map((item, index) => (
                    <th
                      scope="col"
                      className={`${index === 0 ? "px-4 py-3" : "px-6 py-3"}`}
                      key={index}
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white dark:text-gray-300 odd:dark:bg-gray-900 text-black font-medium even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td className="whitespace-nowrap px-6 py-4">{index + 1}.</td>
                    <td className="whitespace-nowrap px-6 py-4">{item.plan}</td>
                    <td className="flex  gap-2 whitespace-nowrap px-6 py-4 ">
                      <p>{item.user_1}</p> &
                      <p>{item.user_2}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      ₹ {item.matching_amount}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {item.date.split(" ")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
