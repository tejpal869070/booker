import React, { useEffect, useState } from "react";
import { GetDirectDownline } from "../../Controllers/User/UserController";
import { toast } from "react-toastify";
import { Loading1, Loading3 } from "../Loading1";

export default function DirextDownline() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    try {
      const response = await GetDirectDownline();
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
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1 className="mb-4 font-bold text-lg dark:text-white">
        Direct Downline{" "}
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full border-4 rounded-sm border-indigo-300 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs   font-semibold text-gray-100 uppercase bg-indigo-500 dark:bg-gray-800 dark:text-gray-200">
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
                BALANCE
              </th>
              <th scope="col" className="px-6 py-3">
                TOTAL INVST
              </th>
              <th scope="col" className="px-6 py-3">
                PAID/UNPAID
              </th>
            </tr>
          </thead>
          {data.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan="8" className="text-center p-4">
                  <div>
                    <img
                      alt="no data"
                      src={require("../../assets/photos/nodata.png")}
                      className="m-auto w-40"
                    />
                    <p className="text-center font-bold dark:text-white text-xl">
                      No Records !
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="odd:bg-white text-black font-semibold odd:dark:bg-gray-900 dark:text-gray-300 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                  >
                    {index + 1}.
                  </th>
                  <td className="whitespace-nowrap px-6 py-4">{item.username}</td>
                  <td className="whitespace-nowrap px-6 py-4">{item.mobile}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.position === "L"
                      ? "LEFT"
                      : item.position === "R"
                      ? "RIGHT"
                      : ""}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{item.date.split("T")[0]}</td>
                  <td className="whitespace-nowrap px-6 py-4">₹{Number(item.balance).toFixed(2)}</td>
                  <td className="whitespace-nowrap px-6 py-4">${item.total_investment}</td>
                  <td className="whitespace-nowrap px-6 py-4">{item.paidType}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
