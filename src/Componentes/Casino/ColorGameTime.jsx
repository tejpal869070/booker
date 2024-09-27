import React, { useCallback, useEffect, useState } from "react";
import Timer from "../GamesComponent/Timer";
import NumberColor from "../GamesComponent/NumberColor";
import ColorGameHistory from "../GamesComponent/ColorGameHistory";
import ColorGameChart from "../GamesComponent/ColorGameChart";
import ColorGameMyHistory from "../GamesComponent/ColorGameMyHistory";
import bg1 from "../../assets/photos/bg1.png";
import ColorGamePopup from "../GamesComponent/ColorGamePopup";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import {
  ColorGameColors,
  ColorGameCurrentData,
  ColorGameNumbers,
} from "../../Controllers/User/GamesController";
import swal from "sweetalert";
import { Loading1 } from "../Loading1";
import FlipCountdown from "@rumess/react-flip-countdown";
import { GetUserDetails } from "../../Controllers/User/UserController";

export default function ColorGame({ gameType }) {
  const [selectedHistoryTab, setSelectedHistoryTab] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [GameColors, setGameColors] = useState([]);
  const [GameNumber, setGameNumber] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentGameLoading, setCurrentGameLoading] = useState();
  const [currentGameData, setCurrentGameData] = useState();
  const [isCountDown, setIsCountDown] = useState(false);
  const [popupData, setPopupData] = useState();
  const [refreshHistory, setRefreshHis] = useState(true);
  const [user, setUser] = useState();
  const [userLoading, setUserLoading] = useState(true);

  const openPopup = (item) => {
    setIsPopupOpen(true);
    setPopupData(item);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    userDataGet();
  };

  // color game colors and number api
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [numbersResponse, colorsResponse] = await Promise.all([
          ColorGameNumbers(gameType),
          ColorGameColors(gameType),
        ]);
        setGameNumber(numbersResponse.data);
        setGameColors(colorsResponse.data);
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
            window.location.href = "/home";
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameType]);

  // ongoing game data
  const currentData = useCallback(async () => {
    setCurrentGameLoading(true);
    try {
      const response = await ColorGameCurrentData(gameType);
      setCurrentGameData(response.data[0]);
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
          window.location.href = "/home";
        }
      });
    } finally {
      setCurrentGameLoading(false);
    }
  }, [gameType]);

  useEffect(() => {
    currentData();
  }, [currentData]);

  // when game end
  const refresh = () => {
    setIsCountDown(false);
    currentData();
    setRefreshHis((pre) => !pre);
  };

  // count down start
  const countdownFunction = () => {
    setIsCountDown(true);
    setIsPopupOpen(false);
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setUserLoading(false);
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  if (loading || currentGameLoading || userLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading1 />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center px-2">
        <Link
          className="cursor-pointer   "
          to={{ pathname: "", search: "?game=color-game" }}
        >
          <IoHome size={24} className="" />
        </Link>
        <p className="font-medium text-medium pr-4">
          Balance : ₹ {user && user.color_wallet_balnace}
        </p>
      </div>
      <div
        className="flex bg-no-repeat bg-cover px-2 md:px-4 justify-between w-full border-b-2 border-gray pb-2"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <div className="py-2">
          <p className="text-sm font-semibold">Number</p>
          <p className="font-bold">
            {currentGameData && currentGameData.period}
          </p>
        </div>
        <div>
          <Timer
            currentGameData={currentGameData}
            refresh={refresh}
            countdownFunction={countdownFunction}
          />
        </div>
      </div>

      <div className="relative bg-gradient-to-r from-rose-100 to-teal-100 dark:bg-gradient-to-r dark:from-slate-500 dark:to-slate-800 py-4">
        {/* color buttons */}
        <div className="flex justify-between lg:justify-center lg:gap-12 justify-center py-2 border-b-2 border-white">
          {GameColors &&
            GameColors.map((item, index) => (
              <div
                key={index}
                onClick={() => openPopup(item)}
                className={`px-6 md:px-8 cursor-pointer  hover:shadow-lg rounded-lg py-3  `}
                style={{ backgroundColor: item.color_code }}
              >
                <button className="text-2xl font-bold text-white">
                  {item.color_name}
                </button>
              </div>
            ))}
        </div>

        {/* color numbers */}
        <NumberColor
          numbersData={GameNumber}
          currentGameData={currentGameData && currentGameData}
        />

        {isCountDown && (
          <div className="absolute w-full h-full top-0 bg-[#000000c9] flex justify-center items-center">
            <FlipCountdown
              size="large"
              hideYear
              hideMonth
              hideDay
              hideHour
              endAt={currentGameData.end_date} // Date/Time
              // onTimeUp={() => getGameHistory(gameType)}
            />
          </div>
        )}
      </div>

      {/* history */}
      <div className="flex    color-game-history mt-10">
        <button
          className={`${
            selectedHistoryTab === 1 ? "bg-[#ff9600]" : "bg-[#babbbb]"
          }`}
          onClick={() => setSelectedHistoryTab(1)}
        >
          Game History
        </button>

        <button
          className={`${
            selectedHistoryTab === 3 ? "bg-[#ff9600]" : "bg-[#babbbb]"
          }`}
          onClick={() => setSelectedHistoryTab(3)}
        >
          My History
        </button>
      </div>

      {/* history tabs */}
      <div className="border-2 border-gray-400 mt-2 rounded-lg p-1">
        {selectedHistoryTab === 1 ? (
          <ColorGameHistory
            gameType={gameType}
            refreshHistory={refreshHistory}
          />
        ) : (
          <ColorGameMyHistory gameType={gameType} />
        )}
      </div>

      {/* popup */}
      <ColorGamePopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        popupData={popupData}
        currentGameData={currentGameData && currentGameData}
      />
    </div>
  );
}
