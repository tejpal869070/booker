import React, { useEffect, useState } from "react";
import { GetMyDownline } from "../../Controllers/User/UserController";
import { toast } from "react-toastify";
import { Loading1 } from "../Loading1";

export default function Downlinemember() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    try {
      const response = await GetMyDownline();
      if (response.status) {
        setData(response.data);
        setLoading(false);
      } else {
        toast.error("Something Went Wrong. Please Refresh.");
        setData([]);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something Went Wrong. Please Refresh.");
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading1 />
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-4 font-bold text-lg dark:text-white">
        Downline Member
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs font-semibold text-gray-100 uppercase bg-indigo-500 dark:bg-gray-800 dark:text-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                S.No.
              </th>
              <th scope="col" className="px-6 py-3">
                USERNAME
              </th>
              <th scope="col" className="px-6 py-3">
                PHONE
              </th>
              <th scope="col" className="px-6 py-3">
                POSITION
              </th>
              <th scope="col" className="px-6 py-3">
                JOINING
              </th>
              <th scope="col" className="px-6 py-3">
                PAID/UNPAID
              </th>
              <th scope="col" className="px-6 py-3">
                TOTAL INVST
              </th>
              <th scope="col" className="px-6 py-3">
                FIRST INVST. DATE
              </th>
            </tr>
          </thead>
          {data.length === 0 ? (
            <tbody>
              <tr>
                <td colspan="8" className="text-center p-4">
                  No Records Found!
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className=" text-black font-semibold dark:text-gray-300   border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}.
                  </th>
                  <td className="px-6 py-4">{item.username}</td>
                  <td className="px-6 py-4">{item.phone}</td>
                  <td className="px-6 py-4"> 
                    {item.position === "L"
                      ? "LEFT"
                      : item.position === "R"
                      ? "RIGHT"
                      : ""}
                  </td>
                  <td className="px-6 py-4">{item.date?.split("T")[0]}</td>
                  <td className="px-6 py-4">{item.paidType}</td>
                  <td className="px-6 py-4">{item.totalInvest}</td>
                  <td className="px-6 py-4">{item.firstInveDate}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
