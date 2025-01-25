import React, { useEffect, useState } from "react";
import { GetGameHistoryByType } from "../../../Controllers/User/GamesController";

export default function GameHistory({ type }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetGameHistoryByType(type);
      setData(response.data);
    };
    fetchData();
  }, [type]);
  return (
    <div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Game
              </th>
              <th scope="col" class="px-6 py-3">
                Date & Time
              </th>
              <th scope="col" class="px-6 py-3">
                Bet Amount
              </th>
              <th scope="col" class="px-6 py-3">
                Multiplier
              </th>
              <th scope="col" class="px-6 py-3">
                Payout
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
              <th
                scope="row"
                class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Apple MacBook Pro 17"
              </th>
              <td class="px-6 py-2">Silver</td>
              <td class="px-6 py-2">Laptop</td>
              <td class="px-6 py-2">$2999</td>
              <td class="px-6 py-2">
                <a
                  href="/"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
              <th
                scope="row"
                class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Microsoft Surface Pro
              </th>
              <td class="px-6 py-2">White</td>
              <td class="px-6 py-2">Laptop PC</td>
              <td class="px-6 py-2">$1999</td>
              <td class="px-6 py-2">
                <a
                  href="/"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
              <th
                scope="row"
                class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Magic Mouse 2
              </th>
              <td class="px-6 py-2">Black</td>
              <td class="px-6 py-2">Accessories</td>
              <td class="px-6 py-2">$99</td>
              <td class="px-6 py-2">
                <a
                  href="/"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
              <th
                scope="row"
                class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Google Pixel Phone
              </th>
              <td class="px-6 py-2">Gray</td>
              <td class="px-6 py-2">Phone</td>
              <td class="px-6 py-2">$799</td>
              <td class="px-6 py-2">
                <a
                  href="/"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Apple Watch 5
              </th>
              <td class="px-6 py-2">Red</td>
              <td class="px-6 py-2">Wearables</td>
              <td class="px-6 py-2">$999</td>
              <td class="px-6 py-2">
                <a
                  href="/"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
