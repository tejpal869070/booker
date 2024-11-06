import React, { useState, useEffect, useRef, Suspense } from "react";
import audio1 from "../../assets/audio/sound1.mp3";
import audio2 from "../../assets/audio/successSound.mp3";

export default function Timer({
  currentGameData,
  refresh,
  countdownFunction,
  sound,
}) {
  const [minLeft, setMinLeft] = useState("00");
  const [secLeft, setSecLeft] = useState("00");
  const [countDownSound, setCountDownSound] = useState(false);
  const [successSound, setSuccessSound] = useState(false);

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
      const endTime = new Date(currentGameData?.end_date);
      const timeLeft = endTime - currentTime;
      const sound1 = document.getElementById("sound1");

      if (timeLeft <= 0) {
        // game end not trigger refresh function to get new current game data
        setCountDownSound(false);
        setSuccessSound(true);
        refresh();
        setMinLeft("00");
        setSecLeft("00");
        clearInterval(intervalId); // Clear the interval on game end
      } else {
        const countdownLimit = Number(currentGameData.coundown) * 1000;
        if (timeLeft < countdownLimit) {
          // countdown start here
          countdownFunction();
          setCountDownSound(true);
        }
        setSuccessSound(false)
        const { minutes, seconds } = calculateTimeLeft(timeLeft);
        setMinLeft(minutes);
        setSecLeft(seconds);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentGameData]);

  useEffect(() => {
    const sound1 = document.getElementById("sound1");
    if (sound && countDownSound) {
      sound1.play();
    } else {
      sound1.pause();
    }
  }, [sound, countDownSound]);
  
  useEffect(() => {
    const sound2 = document.getElementById("sound2");
    if (sound && successSound) { 
      sound2.play();
    }  
  }, [sound, successSound]);

  return (
    <div className="mt-2">
      <audio loop id="sound1">
        <source src={audio1} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <audio id="sound2">
        <source src={audio2} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <div className="border-4 border-black rounded-lg px-4 py-1 inline-block bg-gray-100 shadow-lg">
        <h1 className="font-semibold ">Time Remaining</h1>
        <h2 className="text-center font-bold text-4xl">
          {minLeft}:{secLeft}
        </h2>
      </div>
    </div>
  );
}
