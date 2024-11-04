import React, { useCallback, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { MyInvestMentHistory } from "../../Controllers/User/UserController";
import { Loading1 } from "../Loading1";
import Details from "./Details";
import gif1 from "../../assets/photos/nodatagif.gif";

export default function InvestmentHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [singleData, setSingleData] = useState();

  function getEndDate(initialDate, days) {
    const date = new Date(initialDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  }

  const GetHistory = async () => {
    const response = await MyInvestMentHistory();
    if (response !== null) {
      setData(response);
      setLoading(false);
    } else {
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    GetHistory();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading1 />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className=" ">
        <div>
          <h1 className="mb-6 font-bold text-lg dark:text-white">
            Investment {">"}Investment History
          </h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {data && data.length === 0 ? (
              <div>
                <img alt="no data" src={gif1} className="m-auto" />
                <p className="text-center font-bold text-xl">No Records !</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-indigo-400 border-4">
                <thead className="text-xs font-semibold text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      S.No.
                    </th>
                    <th scope="col" className="px-4 py-3">
                      INVESTMENT
                    </th>
                    <th scope="col" className="hidden md:table-cell px-6 py-3">
                      TYPE
                    </th>
                    <th scope="col" className="hidden md:table-cell px-6 py-3">
                      CLAIM TIME
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="hidden md:table-cell px-6 py-3">
                      DATE START
                    </th>
                    <th scope="col" className="hidden md:table-cell px-6 py-3">
                      DATE END
                    </th>
                    <th scope="col" className="px-4 py-3">
                      VIEW
                    </th>
                  </tr>
                </thead>
                {data.map((item, index) => (
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
                        className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap dark:text-white"
                      >
                        {index + 1}.
                      </th>
                      <td className="px-4 py-4">₹{item.amount}</td>
                      <td className="px-4 py-4 hidden md:table-cell">{item.plan_name}</td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        {item.times} {item.title}
                      </td>
                      <td className="px-6 py-4">{item.status}</td>
                      <td className="px-6 py-4 hidden md:table-cell">{item.date.split("T")[0]}</td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        {getEndDate(item.date, Number(item.day_count))}
                      </td>
                      <td className="px-6 py-4">
                        <FaEye
                          size={20}
                          className="cursor-pointer"
                          onClick={() => {
                            setIsOpen(true);
                            setSingleData(item);
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <Details singleData={singleData} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
