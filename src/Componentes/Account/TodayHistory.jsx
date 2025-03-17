import React, { useCallback, useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import gif1 from "../../assets/photos/nodata.png";
import { GetAccountAllStatement } from "../../Controllers/User/UserController";
import { Loading1, Loading3 } from "../Loading1";

export default function TodayHistory() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setData(
          response.data.filter((item) => {
            const itemDate = new Date(item.date);
            const today = new Date();
            return (
              itemDate.getFullYear() === today.getFullYear() &&
              itemDate.getMonth() === today.getMonth() &&
              itemDate.getDate() === today.getDate()
            );
          })
        );

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

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className=" ">
        <div>
          <h1 className="mb-6 font-bold text-lg dark:text-white">
            Account {">"}Today History
          </h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {data && data.length === 0 ? (
              <div>
                <img alt="no data" src={gif1} className="m-auto" />
                <p className="text-center dark:text-gray-300 font-bold text-xl">No Records !</p>
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
                      DATE
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
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                      >
                        {index + 1}.
                      </th>
                      <td className="whitespace-nowrap px-4 py-4">{item.type}</td>
                      <td className="whitespace-nowrap px-6 py-4">{item.date.split("T")[0]}</td>
                      <td className="whitespace-nowrap px-6 py-4">{item.type === "Investment" ? "$ " : "₹"}{item.amount}</td>
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
