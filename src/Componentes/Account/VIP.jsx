import React, { useState } from "react";
import Slider from "react-slick";
import ProgressBar from "@ramonak/react-progress-bar";
import { FaCrown } from "react-icons/fa6";
import bg1 from "../../assets/photos/Untitled-1-02.png";

export default function VIP() {
  const [tab, setTab] = useState(1);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 1000,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="mb-10 lg:mt-6 h-screen pb-10">
      <Slider {...settings}>
        {plans.map((item, index) => (
          <div className="relative px-2 pb-4">
            <img
              className="w-[95%] h-[12rem] lg:h-40 rounded-lg  absolute top-0"
              src={item.img1}
              alt="baner"
            />
            <div className="relative px-6 py-4 text-white z-[1000] ">
              <h1 className="text-3xl lg:text-xl font-bold flex items-center gap-2">
                <FaCrown />
                {item.title}
              </h1>
              <p className="font-normal text-sm lg:text-xs">
                Upgrading to {item.title} requires{" "}
              </p>
              <p className="font-semibold text-xl lg:text-lg">
                ₹{item.mininum} Amount
              </p>
              <p className="text-right text-xs mr-2  mt-4 lg:mt-0">
                {item.title}
              </p>
              <ProgressBar
                completed={item.currentComplete}
                maxCompleted={100}
                height="15px"
                labelSize="11px"
                className=""
              />
              <div className="flex justify-between mt-1.5">
                <p className="text-sm lg:text-[10px] rounded-xl font-medium px-3  bg-gradient-to-r from-blue-200 to-cyan-200 text-gray-700">
                  {item.currentComplete}/{item.mininum}
                </p>
                <p className="text-sm lg:text-[12px]">
                  Require ₹{item.mininum - item.currentComplete} to Upgrade
                </p>
              </div>
            </div>
            <div className="relative   bg-gray-900 rounded w-[98%] m-auto">
              <div className="mt-6">
                <ul>
                  <li className="flex gap-2 py-2">
                    <div className="flex justify-center items-center p-2 rounded-xl border shadow-lg">
                      <img
                        alt="icons"
                        src={require("../../assets/photos/giftbox.png")}
                        className="w-12"
                      />
                    </div>
                    <div className="flex flex-col  justify-center font-medium  text-gray-300 text-md lg:text-sm">
                      <p>
                        Level Up Reward{" "}
                        <span className="text-[green] bg-gray-200 px-2 rounded-lg">
                          ₹{item.levelReward}
                        </span>
                      </p>
                      <p>Will receive only 1 time</p>
                    </div>
                  </li>
                  <li className="flex gap-2 py-2">
                    <div className="flex justify-center items-center p-2 rounded-xl border shadow-lg">
                      <img
                        alt="icons"
                        src={require("../../assets/photos/premium-quality.png")}
                        className="w-12"
                      />
                    </div>
                    <div className="flex flex-col  justify-center font-medium  text-gray-300 text-md lg:text-sm">
                      <p>
                        Monthly Reward{" "}
                        <span className="text-[green] bg-gray-200 px-2 rounded-lg">
                          {item.monthyReward}%
                        </span>
                      </p>
                      <p>Will receive on 1st of every month</p>
                    </div>
                  </li>
                  <li className="flex gap-2 py-2">
                    <div className="flex justify-center items-center p-2 rounded-xl border shadow-lg">
                      <img
                        alt="icons"
                        src={require("../../assets/photos/telegram.png")}
                        className="w-12"
                      />
                    </div>
                    <div className="flex flex-col  justify-center font-medium  text-gray-300 text-md lg:text-sm">
                      <p>Premium Telegram</p>
                      <p>Membership</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <div className="relative   w-full flex bg-indigo-400 rounded px-2 lg:px-4 py-6">
        <button
          onClick={() => setTab(1)}
          className={`w-1/2 text-center dark:text-gray-200 py-3 ${
            tab === 1
              ? "border border-b-0 rounded-t-lg"
              : "border-b-4 border-skyblue-800"
          }`}
        >
          History
        </button>
        <button
          onClick={() => setTab(2)}
          className={`w-1/2 text-center dark:text-gray-200 py-3 ${
            tab === 2
              ? "border border-b-0 rounded-t-lg"
              : "border-b-4 border-skyblue-800"
          }`}
        >
          Rules
        </button>
      </div>

      {tab === 1 ? (
        data.length === 0 ? (
          <div>
            <img
              aria-label="empty"
              src={require("../../assets/photos/empty-box.png")}
              className="m-auto w-40"
            />
            <p className="text-center dark:text-gray-200">No Record Found</p>
          </div>
        ) : (
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-2 py-3">
                    S.No
                  </th>
                  <th scope="col" class="px-4 py-3">
                    Amount
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th
                      scope="row"
                      class="px-2 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {index + 1}.
                    </th>
                    <td class="px-4 py-3 ">₹{item.amount}</td>
                    <td class="px-6 py-3">{item.type}</td>
                    <td class="px-6 py-3">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        rules.map((item, index) => (
          <div className="px-4 rounded bg-indigo-400 mt-2 py-3">
            <p className="text-center px-4 bg-red-400 rounded-t-md py-1 text-gray-200 font-medium">{item.name}</p>
            <p className="text-justify dark:text-gray-700 mt-1">{item.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

const plans = [
  {
    id: 1,
    title: "VIP1",
    img1: require("../../assets/photos/vip1bg.jpg"),
    mininum: 1000,
    currentComplete: 40,
    active: true,
    monthyReward: "1",
    levelReward: "100",
  },
  {
    id: 2,
    title: "VIP2",
    img1: require("../../assets/photos/vip2bg.jpg"),
    mininum: 50000,
    currentComplete: 30,
    active: false,
    monthyReward: "1.5",
    levelReward: "150",
  },
  {
    id: 3,
    title: "VIP3",
    img1: require("../../assets/photos/vip3bg.jpg"),
    mininum: 10000,
    currentComplete: 24,
    active: false,
    monthyReward: "2",
    levelReward: "300",
  },
  {
    id: 4,
    title: "VIP4",
    img1: require("../../assets/photos/vip4bg.jpg"),
    mininum: 500000,
    currentComplete: 15,
    active: false,
    monthyReward: "2.5",
    levelReward: "500",
  },
];

const data = [
  {
    id: 1,
    amount: 100,
    type: "Monthly Reward",
    date: "2024-12-01",
  },
  {
    id: 2,
    amount: 200,
    type: "Level Up Reward",
    date: "2024-12-04",
  },
];

const rules = [
  {
    id: 1,
    name: "Upgrade Bonus",
    description:
      "The upgrade benefits can be claimed on the VIP page after the member reaches the VIP membership level, and each VIP member can only get the upgrade reward of each level once.",
  },
  {
    id: 2,
    name: "Monthly Reward",
    description:
      "VIP members can earn the highest level of VIP rewards once a month.Can only be received once a month. Prizes cannot be accumulated. And any unclaimed rewards will be refreshed on the next settlement day. When receiving the highest level of monthly rewards this month Monthly Rewards earned in this month will be deducted e.g. when VIP1 earns 500 and upgrades to VIP2 to receive monthly rewards 500 will be deducted.",
  },
];
