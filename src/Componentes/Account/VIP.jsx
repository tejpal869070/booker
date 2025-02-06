import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ProgressBar from "@ramonak/react-progress-bar";
import { FaCrown } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import {
  GetUserDetails,
  GetVipPlans,
} from "../../Controllers/User/UserController";
import { API } from "../../Controllers/Api";
import { Loading1 } from "../Loading1";

export default function VIP() {
  const [tab, setTab] = useState(1);
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
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

  const getVipPlans = async () => {
    try {
      const response = await GetVipPlans();
      if (response && response.status) {
        setPlans(response.data);
      }
    } catch (error) {
      window.alert("Server Error. Try Again !");
    }
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getVipPlans();
    userDataGet();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading1 />
      </div>
    );
  }

  return (
    <div className="mb-10  h-screen pb-10">
      <div className="w-full  flex w-full justify-between bg-white rounded-md mb-2 px-2 py-1">
        <div>
          <p className="font-semibold text-gray-700">Total Wagering</p>
          <p className="font-semibold text-lg text-green-500">
            ₹{Number(user?.wagering).toFixed(2)}
          </p>
        </div>
        <button className="px-4 text-lg py-1 rounded bg-green-600 font-semibold text-gray-200 ">Claim Reward</button>
      </div>
      <Slider {...settings}>
        {plans.map((item, index) => (
          <div
            className="relative px-2 bg-gray-500 rounded-md border-gray-100 border-x-2 border-y-0 pt-2 pb-2"
            key={index}
          >
            <img
              className="w-[95%] h-[12rem] lg:h-40 rounded-lg  absolute top-2"
              src={API.url + "assets/img/" + item.bgimage}
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
                ₹{item.minimumrebetamount} Amount
              </p>
              <p className="text-right text-xs mr-2  mt-4 lg:mt-0">
                {item.title}
              </p>
              <ProgressBar
                completed={Math.max(
                  0,
                  Math.min(
                    (Number(user?.wagering).toFixed(2) /
                      Number(item.minimumrebetamount)) *
                      100,
                    100
                  ).toFixed(2)
                )}
                maxCompleted={100}
                height="15px"
                labelSize="11px"
                className=""
              />

              {/* <ProgressBar
                completed={500 /1000 * 100}
                maxCompleted={100}
                height="15px"
                labelSize="11px"
                className=""
              /> */}
              <div className="flex justify-between mt-1.5">
                <p className="text-sm lg:text-[10px] rounded-xl flex items-center justify-center font-medium px-3  bg-gradient-to-r from-blue-200 to-cyan-200 text-gray-700">
                  {/* {user?.wagering}/{item.minimumrebetamount} */}
                  {Number(user?.wagering) >= Number(item.minimumrebetamount) ? (
                    <MdVerified size={20} color="green" />
                  ) : (
                    `${Number(user?.wagering).toFixed(2)}/${
                      item.minimumrebetamount
                    }`
                  )}
                </p>
                <p className="text-sm lg:text-[12px]">
                  {Number(item.minimumrebetamount) - Number(user?.wagering) > 0
                    ? `Require ₹ ${(
                        Number(item.minimumrebetamount) - Number(user?.wagering)
                      ).toFixed(2)} `
                    : "Upgraded"}
                </p>
              </div>
            </div>
            <div className="relative   bg-gray-900 rounded w-[98%]  m-auto">
              <div className="mt-6">
                <ul>
                  <li className="flex gap-2 py-2 px-2">
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
                          ₹{item.levelreward}
                        </span>
                      </p>
                      <p>Will receive only 1 time</p>
                    </div>
                  </li>
                  <li className="flex gap-2 py-2 px-2">
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
                          {item.monthyreward}%
                        </span>
                      </p>
                      <p>Will receive on 1st of every month</p>
                    </div>
                  </li>
                  <li className="flex gap-2 py-2 px-2">
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
            {Number(item.id) === Number(user?.wagring_id) && (
              <div className="w-[98%] m-auto mt-2 rounded-md bg-[#27cb94] py-2 cursor-pointer  text-center font-semibold text-gray-100 ">
                Claim Reward
              </div>
            )}
          </div>
        ))}
      </Slider>

      <div className="relative mt-4  w-full flex bg-indigo-400 rounded px-2 lg:px-4 py-6">
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
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-2 py-3">
                    S.No
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* {data.map((item, index) => (
                  <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                    >
                      {index + 1}.
                    </th>
                    <td className="whitespace-nowrap px-4 py-3 ">₹{item.amount}</td>
                    <td className="whitespace-nowrap px-6 py-3">{item.type}</td>
                    <td className="whitespace-nowrap px-6 py-3">{item.date}</td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        )
      ) : (
        rules.map((item, index) => (
          <div key={index} className="px-4 rounded bg-indigo-400 mt-2 py-3">
            <p className="text-center px-4 bg-red-400 rounded-t-md py-1 text-gray-200 font-medium">
              {item.name}
            </p>
            <p className="text-justify dark:text-gray-700 mt-1">
              {item.description}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

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
