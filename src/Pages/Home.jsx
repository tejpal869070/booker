import React, { useEffect, useMemo, useRef, useState } from "react";
import { FcPortraitMode } from "react-icons/fc";
import { IoLogOut } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { PiNetworkFill } from "react-icons/pi";
import { RiAccountCircleFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";
import InnerSection from "./userPages/InnerSection";
import { FaCoins } from "react-icons/fa6";
import Cookies from "js-cookie";
import { GetUserDetails } from "../Controllers/User/UserController";
import ThemeToggle from "../Controllers/ThemeToggle";
import { Loading1 } from "../Componentes/Loading1";
import CreatePin from "../Componentes/Dashboard/CratePin";
import Logo from "../assets/photos/mainlogo.png";
import { RiVipDiamondFill } from "react-icons/ri";

export default function Home() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = useState(true);
  const dropdownClassList =
    "flex w-full p-2 pl-0 text-gray-900 rounded-lg group dark:text-black dark:hover:text-black  hover:bg-[#919ffdfc]  hover:animate-fade-right hover:animate-once hover:justify-center hover:animate-duration-[400ms]";

  // close side bar on url change
  // const location = useLocation();

  // const paramsData = useMemo(() => {
  //   const queryParams = new URLSearchParams(location.search);
  //   const params = {};
  //   for (const [key, value] of queryParams.entries()) {
  //     params[key] = value;
  //   }
  //   return params;
  // }, [location.search]); // Dependency is only location.search

  // useEffect(() => {
  //   const sidebar = document.getElementById("sidebar-multi-level-sidebar");
  //   if (sidebar) {
  //     sidebar.classList.toggle("translate-x-0");
  //     sidebar.classList.toggle("-translate-x-full");
  //   }
  // }, [paramsData]);

  // close side bar---------------------------------------------------------------

  const handleHideSideBar = () => {
    const sidebar = document.getElementById("sidebar-multi-level-sidebar");
    sidebar.classList.toggle("translate-x-0");
    sidebar.classList.toggle("-translate-x-full");
  };

  const handleLogout = async () => {
    Cookies.remove("token");
    Cookies.remove("mobile");
    localStorage.removeItem("userDetails");
    window.location.href = "/";
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      localStorage.setItem("userDetails", JSON.stringify(response[0]));
      setLoading(false);
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prevState) => !prevState);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center m-auto inset-0">
        <Loading1 />
      </div>
    );
  }

  return (
    <div className="relative dark:bg-black w-full h-full overflow-x-hidden">
      <div className="md:hidden w-full z-[999]  pt-2 pb-2 flex items-center justify-center ">
        <Link
          to={{ pathname: "/home", search: `?dashboard` }}
          className="flex items-center space-x-3 rtl:space-x-reverse  sm:pl-64"
        >
          <img src={Logo} className=" w-[40%] m-auto" alt="bLogo" />
        </Link>
      </div>
      <nav className="hidden md:block bg-gradient-to-r from-blue-800 to-indigo-900 z-10 border-b-2 border-gray-200 dark:bg-gray-900 fixed w-full">
        <div className="  flex flex-wrap items-center justify-between mx-auto p-4">
          {/* <Link
            to={{ pathname: "/home", search: `?dashboard` }}
            className="flex items-center space-x-3 rtl:space-x-reverse sm:pl-64"
          >
            <img src={Logo} className="h-8" alt="bLogo" />
             
          </Link> */}
          <div className="sm:pl-64" />
          <div className="flex gap-4 items-center">
            <div className="hidden lg:block">
              <ThemeToggle onNav={true} />
            </div>
            <div className="flex  lg:flex-col items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                type="button"
                className="flex  text-sm bg-gray-800 rounded-full md:me-0 ring-4 ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                onClick={toggleDropdown}
              >
                <FcPortraitMode size={30} />
              </button>
              <div
                className={`z-50 my-4 mt-10 border-[0.01px] border-gray right-2 top-6 md:top-4 shadow-xl text-base list-none bg-white absolute divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${
                  isOpen ? "" : "hidden"
                }`}
                ref={dropdownRef}
                id="user-dropdown"
              >
                <div className="px-4 py-3 border-b-2 border-gray">
                  <span className="block  text-gray-900 dark:text-white">
                    {user.uname}
                  </span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                    {user.email}
                  </span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                    M.No. {user.mobile}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="/home"
                      className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <Link
                      to={{ pathname: "/home", search: "?change=securityPin" }}
                      className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Change Security Pin
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/change-password"}
                      className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <div className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                      <ThemeToggle />
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
              <button
                data-drawer-target="sidebar-multi-level-sidebar"
                data-drawer-toggle="sidebar-multi-level-sidebar"
                aria-controls="sidebar-multi-level-sidebar"
                type="button"
                onClick={() => {
                  const sidebar = document.getElementById(
                    "sidebar-multi-level-sidebar"
                  );
                  sidebar.classList.toggle("translate-x-0");
                  sidebar.classList.toggle("-translate-x-full");
                }}
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-400 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 flex left-0 z-40 w-full sm:w-64 h-screen    transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 w-64 transition-transform border-r-2   sm:translate-x-0   py-4 overflow-y-auto no-scrollbar bg-gradient-to-r from-blue-800 to-indigo-900 dark:bg-gray-800">
          <div className="">
            <Link
              to={{ pathname: "/home", search: `?dashboard` }}
              className="  "
            >
              <img src={Logo} className="w-[60%] m-auto mb-4" alt="bLogo" />
            </Link>
          </div>
          <ul className="space-y-2 font-medium">
            <li className="side-bar-list">
              <Link
                to={{ pathname: "/home", search: `?dashboard` }}
                onClick={handleHideSideBar}
                className="flex items-center p-2 text-gray-900 dark:hover:text-white rounded-lg dark:text-white  dark:hover:bg-gray-100 "
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3 dark:text-black">Dashboard</span>
              </Link>
            </li>
            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-200 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("events-dropdown");
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <PiNetworkFill size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap">
                  Events
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="events-dropdown"
                className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-disc py-2 pl-4 space-y-2  "
              >
                <li className="ml-11  ">
                  <Link
                    to={{ pathname: "/home", search: `?event=inplay` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Inplay
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?event=cricket` }}
                    className={`${dropdownClassList} disabled`}
                    onClick={handleHideSideBar}
                  >
                    Cricket
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?event=football` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Football
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?event=tennis` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Tennis
                  </Link>
                </li>
              </ul>
            </li>

            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("casino-dropdown");
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <FaCoins size={20} className="dark:text-black" />

                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap">
                  Live Casino
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="casino-dropdown"
                className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-disc py-2 pl-4 space-y-2"
              >
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?game=color-game` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Color Play
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?game=mines` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Mines Game
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?game=plinko` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Plinko
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?game=aviator` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Aviator
                  </Link>
                </li>
              </ul>
            </li>
            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown = document.getElementById(
                    "investment-dropdown"
                  );
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <FaMoneyBillTransfer size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap">
                  Investment
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="investment-dropdown"
                className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-disc py-2 pl-2 space-y-2"
              >
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?investment=new-investment`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    New Investment
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?investment=investment-history`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Investment History
                  </Link>
                </li>
              </ul>
            </li>
            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("network-dropdown");
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <PiNetworkFill size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap">
                  Network
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="network-dropdown"
                className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-disc py-2 pl-4 space-y-2"
              >
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?network=downline-member`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    My Downline Member
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?network=direct-downline`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Direct Downline
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?network=add-new-member`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Add New Member
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?network=member-tree&uid=${user?.uid}`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    My Member Tree
                  </Link>
                </li>
              </ul>
            </li>

            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("money-dropdown");
                  moneyDropdown.classList.toggle("hidden");

                  const moneyInDropdown =
                    document.getElementById("money-in-dropdown");
                  moneyInDropdown.classList.add("hidden");

                  const moneyOutDropdown =
                    document.getElementById("money-out-dropdown");
                  moneyOutDropdown.classList.add("hidden");
                }}
              >
                <BsBank2 size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap">
                  Money
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="money-dropdown"
                className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-disc py-2 pl-2 space-y-2"
              >
                <li className="ml-11">
                  <button
                    onClick={() => {
                      const moneyDropdown =
                        document.getElementById("money-in-dropdown");
                      moneyDropdown.classList.toggle("hidden");
                    }}
                    className={`${dropdownClassList}`}
                  >
                    Money In
                  </button>
                </li>
                <ul
                  id="money-in-dropdown"
                  className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-square	 py-2 space-y-2 pl-4"
                >
                  <li>
                    <Link
                      to={{ pathname: "/home", search: `?money=usdt-deposit` }}
                      onClick={handleHideSideBar}
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-6 group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                    >
                      - Money Deposit
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={{
                        pathname: "/home",
                        search: `?money=deposit-history`,
                      }}
                      onClick={handleHideSideBar}
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-6 group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                    >
                      - Deposit History
                    </Link>
                  </li>
                </ul>
                <li className="ml-11">
                  <button
                    onClick={() => {
                      const moneyDropdown =
                        document.getElementById("money-out-dropdown");
                      moneyDropdown.classList.toggle("hidden");
                    }}
                    className={`${dropdownClassList}`}
                  >
                    Money Out
                  </button>
                </li>
                <ul
                  id="money-out-dropdown"
                  className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-square	 py-2 space-y-2 pl-4"
                >
                  <li>
                    <Link
                      to={{ pathname: "/home", search: `?money=withdrawal` }}
                      onClick={handleHideSideBar}
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-6 group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                    >
                      - Withdrawal
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={{
                        pathname: "/home",
                        search: `?money=withdrawal-history`,
                      }}
                      onClick={handleHideSideBar}
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-6 group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                    >
                      - Withdrawal History
                    </Link>
                  </li>
                </ul>
              </ul>
            </li>

            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("account-dropdown");
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <RiAccountCircleFill size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap">
                  My Account
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="account-dropdown"
                className=" hidden py-2 pl-2 list-disc	animate-fade-down animate-duration-500   space-y-2"
              >
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?account=send-money` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Send Money
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?account=today-history` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Today History
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?account=account-history`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Account History
                  </Link>
                </li>
              </ul>
            </li>

            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("income-dropdown");
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <GiTakeMyMoney size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap">
                  My Income
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="income-dropdown"
                className=" hidden py-2 pl-2 list-disc	animate-fade-down animate-duration-500   space-y-2"
              >
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?income=matching-income`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Matching Income
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?income=refferer-income`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Refferer Income
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?income=roi-income` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    ROI Income
                  </Link>
                </li>
              </ul>
            </li>

            <li className="bg-[#ffb2b2] rounded-lg">
              <div
                onClick={handleLogout}
                className="flex items-center cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#abbaff] dark:hover:bg-gray-700 group"
              >
                <IoLogOut size={26} className="dark:text-black" />
                <span className="flex-1 ms-3 dark:text-black whitespace-nowrap">
                  Logout
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div
          onClick={() => {
            const sidebar = document.getElementById(
              "sidebar-multi-level-sidebar"
            );
            sidebar.classList.toggle("translate-x-0");
            sidebar.classList.toggle("-translate-x-full");
          }}
          className="flex-1  sm:hidden border-none"
        ></div>
      </aside>

      {/* bottom navigation in mobile */}
      <div className="md:hidden  fixed w-screen z-[99999]   bottom-0">
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
          <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
            <Link
              to={{ pathname: "/home", search: `?dashboard` }}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                Home
              </span>
            </Link>
            <Link
              to={{ pathname: "/home", search: `?user=wallet` }}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z" />
                <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z" />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                Wallet
              </span>
            </Link>
            <Link
              to={{ pathname: "/home", search: "?user=VIP" }}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <RiVipDiamondFill
                className="text-[#6B7280] dark:text-[#9CA3AF] "
                size={26}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                VIP
              </span>
            </Link>
            <Link
              to={{ pathname: "/home", search: `?user=profile` }}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                Profile
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-no-repeat bg-cover bg-fixed dark:bg-black ">
        <div className="p-2 md:p-8 sm:ml-64  pb-24 md:pt-24  ">
          <InnerSection />
        </div>
      </div>

      {/* Create pin */}
      {user && user?.user_pin === "N" && <CreatePin />}
    </div>
  );
}
