import React, { useState, useEffect } from "react";

export default function Timer({
  currentGameData,
  refresh,
  countdownFunction,
  sound,
}) {
  const end_time = new Date(currentGameData?.end_date);
  const api_get_time = new Date(currentGameData?.api_get_time);
  const [minLeft, setMinLeft] = useState("00");
  const [secLeft, setSecLeft] = useState("00");

  const totalDuration = end_time - api_get_time;  

  const [timeRemaining, setTimeRemaining] = useState(totalDuration);  

  useEffect(() => { 
    const newTotalDuration =
      new Date(currentGameData?.end_date) -
      new Date(currentGameData?.api_get_time);
    setTimeRemaining(newTotalDuration);

    if (newTotalDuration <= 0) {
      console.log("refresh to get new current game data");
      refresh();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(intervalId);
          refresh();  
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentGameData]); // Only depend on currentGameData

  return (
    <div className="mt-2">
      <div className="border-4 border-black rounded-lg px-4 py-1 inline-block bg-gray-100 shadow-lg">
        <h1 className="font-semibold ">Time Remaining</h1>
        <h2 className="text-center font-bold text-4xl">
          {Math.floor(timeRemaining / 1000)}
        </h2>
      </div>
    </div>
  );
}
