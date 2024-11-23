import React, { useState, useEffect } from "react";

export default function CountDownTimer() {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative w-16 h-24 rounded-md bg-gray-800 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-4xl font-bold text-white"
          style={{ transform: `translateY(${minutes < 10 ? "50%" : "100%"})` }}
        >
          {minutes}
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-full flex items-center justify-center text-4xl font-bold text-white"
          style={{ transform: `translateY(${minutes < 10 ? "50%" : "0%"})` }}
        >
          {minutes < 10 ? 0 : ""}
        </div>
      </div>
      <div className="relative w-16 h-24 rounded-md bg-gray-800 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-4xl font-bold text-white"
          style={{
            transform: `translateY(${remainingSeconds < 10 ? "50%" : "100%"})`,
          }}
        >
          {remainingSeconds}
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-full flex items-center justify-center text-4xl font-bold text-white"
          style={{
            transform: `translateY(${remainingSeconds < 10 ? "50%" : "0%"})`,
          }}
        >
          {remainingSeconds < 10 ? 0 : ""}
        </div>
      </div>
    </div>
  );
}
