import React, { useCallback, useEffect, useState } from "react";
import { MyColorGameHistory } from "../../Controllers/User/GamesController";
import { Loading1 } from "../Loading1";
import swal from "sweetalert";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaCircleChevronDown } from "react-icons/fa6";

export default function ColorGameMyHistory({ gameType, refreshHistory }) {
  console.log(refreshHistory)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageId, setPageId] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState();
  const [visible, setVisible] = useState(false);

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
  }, [gameType, fetchHistory, refreshHistory]);

  // if (loading) {
  //   return (
  //     <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
  //       <Loading1 />
  //     </div>
  //   );
  // }
  return (
    <div className="">
      <div className="color-game-history">
        <button className="bg-[#ff9600]">My History</button>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full relative text-[16px] font-semibold text-left rtl:text-right text-black dark:text-gray-400">
          <thead className="text-sm text-black uppercase bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Period
              </th>
              <th scope="col" className="px-4 py-3 hidden md:table-cell">
                AMOUNT
              </th>
              <th scope="col" className="px-6 py-4 hidden md:table-cell">
                Type
              </th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">
                Choosen
              </th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">
                result
              </th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">
                P/L
              </th>
              <th scope="col" className="px-6 py-3  md:hidden">
                Result
              </th>
              <th scope="col" className="px-6 py-3  md:hidden">
                P/L
              </th>
              <th scope="col" className="px-6 py-3  md:hidden">
                View
              </th>
            </tr>
          </thead>

          {data &&
            data.map((item, index) => (
              <tbody className=" ">
                <tr
                  key={index}
                  className={`  border-b-2 border-gray-300 dark:bg-gray-800 dark:border-gray-700  `}
                >
                  <th
                    scope="row"
                    className="px-6 py-[3px] font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.Period}
                  </th>
                  <td className="px-4 py-[3px] hidden md:table-cell  ">
                    {item.price}
                  </td>

                  <td className="px-4 py-[3px] hidden md:table-cell">
                    {item.type}
                  </td>
                  <td className="px-6 py-[3px] hidden md:table-cell">
                    {item.value}
                  </td>
                  <td className="px-6 py-[3px] border-l-2  hidden md:flex flex-row justify-between items-center">
                    <p>{item.open_color}</p>{" "}
                    <p className="rounded-full p-1 bg-[#ffc989] dark:text-gray-900">
                      {item.number}
                    </p>
                  </td>
                  <td className="px-6 py-[3px]   md:hidden flex flex-row justify-center items-center">
                    <p
                      className={`rounded-full  w-8  h-8  flex items-center justify-center  dark:text-gray-900 bg-[${item.open_color}]`}
                    >
                      {item.number}
                    </p>
                  </td>
                  <td
                    className={`px-6 py-[3px]    ${
                      item.type === "Color"
                        ? item.value === "Red"
                          ? item.number === "0"
                            ? "text-[green]"
                            : item.value === item.open_color
                            ? "text-[green]"
                            : "text-[red]"
                          : item.value === "Green"
                          ? item.number === "5"
                            ? "text-[green]"
                            : item.value === item.open_color
                            ? "text-[green]"
                            : "text-[red]"
                          : item.value === "Violet"
                          ? item.number === "0" || item.number === "5"
                            ? "text-[green]"
                            : "text-[red]"
                          : 0
                        : item.value === item.number
                        ? "text-[green]"
                        : "text-[red]"
                    }`}
                  >
                    {item.type === "Color"
                      ? item.value === "Red"
                        ? item.number === "0"
                          ? `+${item.if_open_zero}`
                          : item.value === item.open_color
                          ? `+${item.winning_amount}`
                          : -item.price
                        : item.value === "Green"
                        ? item.number === "5"
                          ? `+${item.if_open_zero}`
                          : item.value === item.open_color
                          ? `+${item.winning_amount}`
                          : -item.price
                        : item.value === "Violet"
                        ? item.number === "0" || item.number === "5"
                          ? `+${item.if_open_zero}`
                          : -item.price
                        : 0
                      : item.value === item.number
                      ? `+${item.winning_amount}`
                      : -item.price}
                  </td>
                  <td
                    className="px-6 py-[3px]  md:hidden"
                    onClick={() => {
                      setSelectedIndex(index);
                      setVisible((pre) => !pre);
                    }}
                  >
                    <FaCircleChevronDown
                      size={20}
                      className="text-black dark:text-gray-200"
                    />
                  </td>
                </tr>
                {visible && selectedIndex === index ? (
                  <tr className="  bg-gray-300  dark:bg-gray-400">
                    <td colSpan="4 " className="py-2">
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Period</p>
                        <p>{item.Period}</p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Amount</p>
                        <p>{item.price}</p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Type</p>
                        <p>{item.type}</p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Seleted</p>
                        <p>{item.value}</p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Result</p>
                        <p className="flex gap-2">
                          <p>{item.open_color}</p>
                          {" /"}
                          <p className=" ">{item.number}</p>
                        </p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Date</p>
                        <p>{item.date?.split("T")[0]}</p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Time</p>
                        <p>{item.date?.split("T")[1]}(UTC)</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  ""
                )}
              </tbody>
            ))}

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
