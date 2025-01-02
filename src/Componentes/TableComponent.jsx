import React from "react";

export default function TableComponent({ tableHead, tableData }) {
  return (
    <div>
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
            {tableData.map((item, index) => (
              <tr
                key={index}
                className="odd:bg-white dark:text-gray-300 odd:dark:bg-gray-900 text-black font-medium even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="whitespace-nowrap px-6 py-4">{index + 1}.</td>
                {Object.entries(item).map(([key, value]) => (
                  <td className="whitespace-nowrap px-6 py-4">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
