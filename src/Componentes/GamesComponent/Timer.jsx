import React, { useState, useEffect } from "react";

export default function Timer({ currentGameData, refresh, countdownFunction }) {
  const [minLeft, setMinLeft] = useState("00");
  const [secLeft, setSecLeft] = useState("00");

  useEffect(() => {
    const calculateTimeLeft = (timeLeft) => {
      const seconds = Math.floor((timeLeft / 1000) % 60);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      return {
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      };
    };

    // loop-----------------------------------------
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const endTime = new Date(currentGameData.end_date);
      const timeLeft = endTime - currentTime;

      if (timeLeft <= 0) {
        // game end not trigger refresh function to get new current game data
        refresh();
        setMinLeft("00");
        setSecLeft("00");
        clearInterval(intervalId); // Clear the interval on game end
      } else {
        const countdownLimit = Number(currentGameData.coundown) * 1000;
        if (timeLeft < countdownLimit) {
          // countdown start here
          countdownFunction();
        }
        const { minutes, seconds } = calculateTimeLeft(timeLeft);
        setMinLeft(minutes);
        setSecLeft(seconds);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentGameData]);

  return (
    <div className="mt-2  ">
      <div className="border-4 border-black rounded-lg px-4 py-1 inline-block bg-gray-100 shadow-lg">
        <h1 className="font-semibold ">Time Remaining</h1>
        <h2 className="text-center font-bold text-4xl">
          {minLeft}:{secLeft}
        </h2>
      </div>
    </div>
  );
}
