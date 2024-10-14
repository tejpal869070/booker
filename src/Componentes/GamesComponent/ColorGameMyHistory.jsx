import React, { useCallback, useEffect, useState } from "react";
import { MyColorGameHistory } from "../../Controllers/User/GamesController";
import { Loading1 } from "../Loading1";
import swal from "sweetalert";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";

export default function ColorGameMyHistory({ gameType }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageId, setPageId] = useState(1);

  const fetchHistory = useCallback(
    async (gameType) => {
      try {
        const response = await MyColorGameHistory(gameType, pageId);
        if (response.status) {
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        swal({
          title: "Error!",
          text: "Something Went Wrong",
          icon: "error",
          buttons: {
            confirm: "OK",
          },
          dangerMode: true,
        }).then((willRedirect) => {
          if (willRedirect) {
            window.location.reload();
          }
        });
      }
    },
    [pageId]
  ); // Add pageId as a dependency

  useEffect(() => {
    fetchHistory(gameType);
  }, [gameType, fetchHistory]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading1 />
      </div>
    );
  }
  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full relative text-[16px] font-semibold text-left rtl:text-right text-black dark:text-gray-400">
          <thead className="text-sm text-black uppercase bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Period
              </th>
              <th scope="col" className="px-4 py-3">
                AMOUNT
              </th>
              <th scope="col" className="px-6 py-4">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Choosen
              </th>
              <th scope="col" className="px-6 py-3">
                result
              </th>
              <th scope="col" className="px-6 py-3">
                P/L
              </th>
            </tr>
          </thead>
          <tbody className=" ">
            {data.map((item, index) => (
              <tr
                key={index}
                // className={`  border-b-2 border-gray-300 dark:bg-gray-800 dark:border-gray-700 ${
                //   item.type === "Color"
                //     ? item.value === item.open_color
                //       ? `bg-[#95ff95]`
                //       : "bg-[#ff7171]"
                //     : item.value === item.number
                //     ? `bg-[#95ff95]`
                //     : "bg-[#ff7171]"
                // }`}
                className={`  border-b-2 border-gray-300 dark:bg-gray-800 dark:border-gray-700 ${
                  item.type === "Color"
                    ? item.value !== "Violet"
                      ? item.value !== item.open_color
                        ? "bg-[#ff7171]"
                        : "bg-[#95ff95]"
                      : item.value === item.open_color ||
                        item.number === "0" ||
                        item.number === "5"
                      ? "bg-[#95ff95]"
                      : "bg-[#ff7171]"
                    : item.value === item.number
                    ? "bg-[#95ff95]"
                    : "bg-[#ff7171]"
                }`}
              >
                <th
                  scope="row"
                  className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.Period}
                </th>
                <td className="px-4 py-2  ">{item.price}</td>
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-6 py-2">{item.value}</td>
                <td className="px-6 py-2 border-l-2 flex justify-between items-center">
                  <p>{item.open_color}</p>{" "}
                  <p className="rounded-full p-1 bg-[#ffc989] dark:text-gray-900">
                    {item.number}
                  </p>
                </td>
                <td className="px-6 py-2 border-l-2">
                  {item.type === "Color"
                    ? item.value !== "Violet"
                      ? item.value !== item.open_color
                        ? -item.price
                        : item.winning_amount
                      : item.value === item.open_color ||
                        item.number === "0" ||
                        item.number === "5"
                      ? item.if_open_zero
                      : -item.price
                    : item.value === item.number
                    ? item.winning_amount
                    : -item.price}
                </td>
              </tr>
            ))}
          </tbody>
          <div className="flex items-center gap-2 ">
            <button
              disabled={pageId === 1}
              onClick={() => setPageId(pageId - 1)}
            >
              <FaArrowCircleLeft size={20} className="cursor-pointer" />
            </button>
            {pageId}
            <button
              disabled={data && data.length < 10}
              onClick={() => setPageId(pageId + 1)}
            >
              <FaArrowCircleRight size={20} className="cursor-pointer" />
            </button>
          </div>
        </table>
      </div>
    </div>
  );
}
